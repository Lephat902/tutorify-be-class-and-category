import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Class } from 'src/class/infrastructure/entities';
import { Injectable } from '@nestjs/common';
import { ClassQueryDto } from 'src/class/application/dtos/class-query.dto';

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
    // classCategoryIds takes precedence over tutorPreferences.classCategoryIds
    if (filters?.classCategoryIds) {
      this.filterByCategoryIds(classQuery, filters.classCategoryIds);
    } else if (filters?.tutorPreferences?.classCategoryIds) {
      this.orderByCategoryPriority(classQuery, filters.tutorPreferences.classCategoryIds)
    }
    this.filterBySubjectIds(classQuery, filters?.subjectIds);
    this.filterByLevelIds(classQuery, filters?.levelIds);
    this.filterBySearchQuery(classQuery, filters.q);
    this.orderByField(classQuery, filters.order, filters.dir);
    this.paginateResults(classQuery, filters.page, filters.limit);
    this.filterByVisibility(classQuery, filters.includeHidden);
    this.filterByAssignmentStatus(classQuery, filters.isAssigned);

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

  private filterByCategoryIds(query: SelectQueryBuilder<Class>, classCategoryIds: string[] | undefined) {
    if (classCategoryIds) {
      query.andWhere('classCategories.id IN (:...classCategoryIds)', {
        classCategoryIds,
      });
    }
  }

  private orderByCategoryPriority(query: SelectQueryBuilder<Class>, classCategoryIds: string[] | undefined) {
    // Assuming classCategoryIds is not empty and is relevant to the query
    if (classCategoryIds) {
      // Apply order by using a CASE statement to prioritize matching category IDs
      query
        .addSelect(`(
          CASE
            WHEN classCategories.id IN (:...classCategoryIds) THEN 0
            ELSE 1
          END)`, "priority")
        .setParameter("classCategoryIds", classCategoryIds)
        .orderBy("priority", "ASC", "NULLS LAST");
    }
  }

  private filterBySubjectIds(query: SelectQueryBuilder<Class>, subjectIds: string[] | undefined) {
    if (subjectIds) {
      query.andWhere('subject.id IN (:...subjectIds)', {
        subjectIds,
      });
    }
  }

  private filterByLevelIds(query: SelectQueryBuilder<Class>, levelIds: string[] | undefined) {
    if (levelIds) {
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

  private filterByAssignmentStatus(query: SelectQueryBuilder<Class>, isAssigned: boolean | undefined) {
    if (isAssigned !== undefined) {
      if (isAssigned) {
        query.andWhere('class.tutorId IS NOT NULL');
      } else {
        query.andWhere('class.tutorId IS NULL');
      }
    }
  }

  private orderByField(query: SelectQueryBuilder<Class>, order: string | undefined, dir: 'ASC' | 'DESC' | undefined) {
    if (order) {
      query.orderBy(`class.${order}`, dir || 'ASC');
    }
  }
}
