import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Class } from 'src/class/infrastructure/entities';
import { Injectable } from '@nestjs/common';
import { ClassQueryDto } from 'src/class/application/dtos/class-query.dto';
import { ClassStatus, StoredLocation } from '@tutorify/shared';

@Injectable()
export class ClassRepository extends Repository<Class> {
  constructor(private dataSource: DataSource) {
    super(Class, dataSource.createEntityManager());
  }

  async getClassesAndTotalCount(
    filters: ClassQueryDto
  ): Promise<{ results: Class[], totalCount: number }> {
    const classQuery = this.createQueryBuilderWithEagerLoading();
    console.log(filters)

    // Apply filters to query 
    if (filters.me)
      this.filterByUserId(classQuery, filters.userId);
    // Location has higher priority than class category
    this.orderByLocationPriority(classQuery, filters?.userPreferences?.location);
    // classCategoryIds takes precedence over userPreferences.classCategoryIds
    if (filters?.classCategoryIds) {
      this.filterByCategoryIds(classQuery, filters.classCategoryIds);
    } else if (filters?.userPreferences?.classCategoryIds) {
      this.orderByCategoryPriority(classQuery, filters.userPreferences.classCategoryIds)
    }
    this.filterByIsOnline(classQuery, filters.isOnline);
    this.filterBySubjectIds(classQuery, filters?.subjectIds);
    this.filterByLevelIds(classQuery, filters?.levelIds);
    this.filterBySearchQuery(classQuery, filters.q);
    this.orderByField(classQuery, filters.order, filters.dir);
    this.paginateResults(classQuery, filters.page, filters.limit);
    this.filterByVisibility(classQuery, filters.includeHidden);
    this.filterByStatuses(classQuery, filters.statuses);

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

  // Get only classes that satisfy classCategoryIds
  private filterByCategoryIds(query: SelectQueryBuilder<Class>, classCategoryIds: string[] | undefined) {
    if (classCategoryIds?.length) {
      query.andWhere('classCategories.id IN (:...classCategoryIds)', {
        classCategoryIds,
      });
    }
  }

  // Make classes that satisfy classCategoryIds to the top of the result, others at last
  private orderByCategoryPriority(query: SelectQueryBuilder<Class>, classCategoryIds: string[] | undefined) {
    // Assuming classCategoryIds is not empty and is relevant to the query
    if (classCategoryIds?.length) {
      // Apply order by using a CASE statement to prioritize matching category IDs
      query
        .addSelect(`(
          CASE
            WHEN classCategories.id IN (:...classCategoryIds) THEN 0
            ELSE 1
          END)`, "priority")
        .setParameter("classCategoryIds", classCategoryIds)
        .addOrderBy("priority", "ASC", "NULLS LAST");
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

  private orderByField(query: SelectQueryBuilder<Class>, order: string | undefined, dir: 'ASC' | 'DESC' | undefined) {
    if (order) {
      query.orderBy(`class.${order}`, dir || 'ASC');
    }
  }
}
