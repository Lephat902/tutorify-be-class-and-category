import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Class } from 'src/class/infrastructure/entities';
import { Injectable } from '@nestjs/common';
import { ClassQueryDto } from 'src/class/application/dtos/class-query.dto';
import { ClassStatus, StoredLocation } from '@tutorify/shared';
import { ClassCategory } from 'src/category/entities';

@Injectable()
export class ClassRepository extends Repository<Class> {
  constructor(private dataSource: DataSource) {
    super(Class, dataSource.createEntityManager());
  }

  async getClassesAndTotalCount(
    filters: ClassQueryDto
  ): Promise<{ results: Class[], totalCount: number }> {
    const classQuery = this.createQueryBuilderWithEagerLoading();
    console.log(filters);

    // Apply filters to query
    this.filterByUserId(classQuery, filters.userIdToGetClasses);
    this.filterByIds(classQuery, filters.ids);
    // classCategoryIds takes precedence over userPreferences.classCategoryIds
    if (filters.classCategoryIds?.length || filters.classCategorySlugs?.length) {
      const isFilteringByIds = !!filters.classCategoryIds?.length;
      const valueToFilter = isFilteringByIds ? filters.classCategoryIds : filters.classCategorySlugs;
      const fieldToFilter = isFilteringByIds ? 'id' : 'slug';
      this.filterByCategories(classQuery, valueToFilter, fieldToFilter);
    } else if (filters?.userPreferences?.classCategoryIds) {
      this.orderByCategoryPriority(classQuery, filters.userPreferences.classCategoryIds)
    }
    // Location has lower priority than class category
    const locationToOrder = filters.location || filters?.userPreferences?.location;
    if (locationToOrder)
      this.orderByLocationPriority(classQuery, locationToOrder);
    this.filterByIsOnline(classQuery, filters.isOnline);
    this.filterBySubjectIds(classQuery, filters?.subjectIds);
    this.filterByLevelIds(classQuery, filters?.levelIds);
    this.filterBySearchQuery(classQuery, filters.q);
    this.orderByField(classQuery, filters.order, filters.dir);
    this.paginateResults(classQuery, filters.page, filters.limit);
    this.filterByVisibility(classQuery, filters.includeHidden);
    this.filterByStatuses(classQuery, filters.statuses);
    this.filterByCreatedAtMin(classQuery, filters.createdAtMin);
    this.filterByCreatedAtMax(classQuery, filters.createdAtMax);
    this.filterByWageMin(classQuery, filters.minWage);
    this.filterByWageMax(classQuery, filters.maxWage);

    // Execute query to get results
    const [results, totalCount] = await classQuery.getManyAndCount();

    return { results, totalCount };
  }

  async getNumberOfClassesByCategoryId(classCategoryId: string): Promise<number> {
    return this
      .createQueryBuilder('class')
      .innerJoin('class.classCategories', 'classCategory')
      .where('classCategory.id = :classCategoryId', { classCategoryId })
      .getCount();
  }

  private createQueryBuilderWithEagerLoading(): SelectQueryBuilder<Class> {
    return this.dataSource
      .createQueryBuilder(Class, 'class')
      .leftJoinAndSelect('class.classCategories', 'classCategories')
      .leftJoinAndSelect('classCategories.subject', 'subject')
      .leftJoinAndSelect('classCategories.level', 'level')
      .leftJoinAndSelect('class.timeSlots', 'timeSlots');
  }

  private filterByUserId(query: SelectQueryBuilder<Class>, userId: string | undefined) {
    if (userId) {
      query.andWhere('(class.studentId = :userId OR class.tutorId = :userId)', {
        userId,
      });
    }
  }

  private filterByIds(query: SelectQueryBuilder<Class>, ids: string[] | undefined) {
    if (ids?.length) {
      query.andWhere('class.id IN (:...ids)', {
        ids,
      });
    }
  }

  // Get only classes that satisfy classCategoryIds
  private filterByCategories(query: SelectQueryBuilder<Class>, values: string[] | undefined, filterBy: 'id' | 'slug') {
    if (values?.length) {
      query.andWhere(`classCategories.${filterBy} IN (:...values)`, {
        values,
      });
    }
  }

  // Make classes that satisfy classCategoryIds to the top of the result, others at last
  private orderByCategoryPriority(query: SelectQueryBuilder<Class>, classCategoryIds: string[] | undefined) {
    // Assuming classCategoryIds is not empty and is relevant to the query
    if (classCategoryIds?.length) {
      // Assuming classCategoryIds is not empty and is relevant to the query
      if (classCategoryIds?.length) {
        query.addSelect(subQuery => {
          return subQuery
            .select("COUNT(classCategory.id)", "count")
            .from(ClassCategory, "classCategory")
            .leftJoin("classCategory.classes", "class1")
            .andWhere("classCategory.id IN (:...classCategoryIds)", { classCategoryIds })
            .andWhere("class1.id = class.id")
        }, `category_count`)
          .addOrderBy(`category_count`, "DESC");
      }
    }
  }

  // Make classes that are nearest to the top of the result, others at last
  private orderByLocationPriority(query: SelectQueryBuilder<Class>, location: StoredLocation) {
    if (location) {
      const longitude = location.coordinates[0];
      const latitude = location.coordinates[1];

      query
        .addSelect(`
          ST_DistanceSphere(
            ST_GeomFromGeoJSON('{"type":"Point","coordinates":[${longitude},${latitude}]}'),
            class.location
          )`, 'distance')
        .addOrderBy('distance', 'ASC', 'NULLS LAST');
    }
  }

  private filterByIsOnline(query: SelectQueryBuilder<Class>, isOnline: boolean | undefined) {
    if (isOnline !== undefined) {
      query.andWhere('class.isOnline = :isOnline', { isOnline });
    }
  }

  private filterBySubjectIds(query: SelectQueryBuilder<Class>, subjectIds: string[] | undefined) {
    if (subjectIds?.length) {
      query.andWhere('subject.id IN (:...subjectIds)', {
        subjectIds,
      });
    }
  }

  private filterByLevelIds(query: SelectQueryBuilder<Class>, levelIds: string[] | undefined) {
    if (levelIds?.length) {
      query.andWhere('level.id IN (:...levelIds)', {
        levelIds,
      });
    }
  }

  private filterBySearchQuery(query: SelectQueryBuilder<Class>, q: string | undefined) {
    if (q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('class.description ILIKE :q', { q: `%${q}%` })
            .orWhere('class.title ILIKE :q', { q: `%${q}%` });
        }),
      );
    }
  }

  private paginateResults(query: SelectQueryBuilder<Class>, page: number | undefined, limit: number | undefined) {
    if (page && limit) {
      query
        .skip((page - 1) * limit)
        .take(limit);
    }
  }

  private filterByVisibility(query: SelectQueryBuilder<Class>, includeHidden: boolean | undefined) {
    if (!includeHidden) {
      query.andWhere('class.isHidden = :isHidden', { isHidden: false });
    }
  }

  private filterByStatuses(query: SelectQueryBuilder<Class>, statuses: ClassStatus[] | undefined) {
    if (statuses !== undefined) {
      query.andWhere('class.status IN (:...statuses)', {
        statuses
      });
    }
  }

  private filterByCreatedAtMin(query: SelectQueryBuilder<Class>, createdAtMin: Date | undefined) {
    if (createdAtMin) {
      query.andWhere('class.createdAt >= :createdAtMin', {
        createdAtMin
      });
    }
  }

  private filterByCreatedAtMax(query: SelectQueryBuilder<Class>, createdAtMax: Date | undefined) {
    if (createdAtMax) {
      query.andWhere('class.createdAt <= :createdAtMax', {
        createdAtMax
      });
    }
  }

  private filterByWageMin(query: SelectQueryBuilder<Class>, minWage: number | undefined) {
    if (minWage) {
      query.andWhere('class.wages >= :minWage', {
        minWage
      });
    }
  }

  private filterByWageMax(query: SelectQueryBuilder<Class>, maxWage: number | undefined) {
    if (maxWage) {
      query.andWhere('class.wages <= :maxWage', {
        maxWage
      });
    }
  }

  private orderByField(query: SelectQueryBuilder<Class>, order: string | undefined, dir: 'ASC' | 'DESC' | undefined) {
    if (order) {
      query.orderBy(`class.${order}`, dir || 'ASC');
    }
  }
}
