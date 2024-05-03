import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClassCategory, Level, Subject } from './entities';
import {
  ClassCategoryRepository,
  LevelRepository,
  SubjectRepository,
} from './repositories';
import {
  BroadcastService,
  ClassCategoryCreatedEvent,
  ClassCategoryCreatedEventPayload,
  ClassStatus,
} from '@tutorify/shared';
import { Builder } from 'builder-pattern';
import { ClassCategoryQueryDto } from './dtos';
import { addGroupByColumns } from './helpers';
import { Brackets, SelectQueryBuilder } from 'typeorm';

type ReturnedLevel = Omit<Level, 'classCategories'>;
type ReturnedSubject = Omit<Subject, 'classCategories'>;
type ReturnedClassCategory = {
  id: string;
  slug: string;
  level: ReturnedLevel;
  subject: ReturnedSubject;
  classCount?: number;
};

@Injectable()
export class ClassCategoryService {
  constructor(
    private readonly classCategoryRepository: ClassCategoryRepository,
    private readonly levelRepository: LevelRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly broadcastService: BroadcastService,
  ) { }

  async findAll(filters: ClassCategoryQueryDto): Promise<ReturnedClassCategory[]> {
    const query = this.buildFindAllQuery(filters);
    const result = await query.getRawMany();
    return this.transformResults(result);
  }

  private buildFindAllQuery(filters: ClassCategoryQueryDto): SelectQueryBuilder<ClassCategory> {
    const { classStatuses, includeHiddenClass, includeClassCount, classCreatedAtMin, classCreatedAtMax } = filters;

    const query = this.classCategoryRepository
      .createQueryBuilder('classCategory')
      .leftJoin('classCategory.subject', 'subject')
      .leftJoin('classCategory.level', 'level')
      .select(['classCategory', 'subject', 'level']);

    this.filterBySearchQuery(query, filters.q);
    this.filterByIds(query, filters.ids);
    this.filterBySlugs(query, filters.slugs);

    if (includeClassCount) {
      query
        .leftJoin('classCategory.classes', 'class')
        .addSelect('COUNT(class.id)', 'classCount')
        .addOrderBy('COUNT(class.id)', 'DESC');

      // Required by AGGREGATE function COUNT
      addGroupByColumns(query, 'classCategory', this.classCategoryRepository);
      addGroupByColumns(query, 'level', this.levelRepository);
      addGroupByColumns(query, 'subject', this.subjectRepository);

      this.filterByClassStatuses(query, classStatuses);
      this.filterByClassVisibility(query, includeHiddenClass);

      if (classCreatedAtMin) {
        query.andWhere('class.createdAt >= :classCreatedAtMin', {
          classCreatedAtMin
        });
      }

      if (classCreatedAtMax) {
        query.andWhere('class.createdAt <= :classCreatedAtMax', {
          classCreatedAtMax
        });
      }

      if (classCreatedAtMax) {
        query.andWhere('class.createdAt <= :classCreatedAtMax', {
          classCreatedAtMax
        });
      }
    }

    // Automatically order by subject name and then level name
    query
      .addOrderBy('subject.name', 'ASC')
      .addSelect('CAST(SUBSTRING(level.name, 1) AS INTEGER)', 'numeric_name')
      .addOrderBy('numeric_name', 'ASC');

    return query;
  }

  private filterBySearchQuery(query: SelectQueryBuilder<ClassCategory>, q: string | undefined) {
    if (q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('subject.name ILIKE :q', { q: `%${q}%` })
            .orWhere('level.name ILIKE :q', { q: `%${q}%` });
        }),
      );
    }
  }

  private filterByIds(query: SelectQueryBuilder<ClassCategory>, ids: string[] | undefined) {
    if (ids?.length) {
      query.andWhere('classCategory.id IN (:...ids)', {
        ids
      });
    }
  }

  private filterBySlugs(query: SelectQueryBuilder<ClassCategory>, slugs: string[] | undefined) {
    if (slugs?.length) {
      query.andWhere('classCategory.slug IN (:...slugs)', {
        slugs
      });
    }
  }

  private filterByClassStatuses(query: SelectQueryBuilder<ClassCategory>, statuses: ClassStatus[] | undefined) {
    if (statuses !== undefined) {
      query.andWhere('class.status IN (:...statuses)', {
        statuses
      });
    }
  }

  private filterByClassVisibility(query: SelectQueryBuilder<ClassCategory>, includeHidden: boolean | undefined) {
    if (!includeHidden) {
      query.andWhere('class.isHidden = :isHidden', { isHidden: false });
    }
  }

  findWholeCategoryHierarchyByIds(ids: string[]): Promise<ClassCategory[]> {
    return this.classCategoryRepository
      .createQueryBuilder('classCategory')
      .leftJoinAndSelect('classCategory.subject', 'subject')
      .leftJoinAndSelect('classCategory.level', 'level')
      .where('classCategory.id IN (:...ids)', { ids })
      .getMany();
  }

  async getCategoryById(id: string) {
    const findAllQuery = this.buildFindAllQuery({
      includeClassCount: true,
    });
    findAllQuery.andWhere('classCategory.id = :id', { id });
    const result = await findAllQuery.getRawOne();
    return this.transformResult(result);
  }

  findAllSubjects(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  findAllLevels(): Promise<Level[]> {
    return this.levelRepository.find();
  }

  async findSubjectsByLevel(levelId: string): Promise<Subject[]> {
    const categories = await this.classCategoryRepository
      .createQueryBuilder('classCategory')
      .leftJoinAndSelect('classCategory.subject', 'subject')
      .where('classCategory.levelId = :levelId', { levelId })
      .getMany();
    return categories.map((category) => category.subject);
  }

  async findLevelsBySubject(subjectId: string): Promise<Level[]> {
    const categories = await this.classCategoryRepository
      .createQueryBuilder('classCategory')
      .leftJoinAndSelect('classCategory.level', 'level')
      .where('classCategory.subjectId = :subjectId', { subjectId })
      .getMany();
    return categories.map((category) => category.level);
  }

  async insert(levelDto: Level, subjectDto: Subject): Promise<ClassCategory> {
    const level = await this.findOrCreateEntity(levelDto, this.levelRepository);
    const subject = await this.findOrCreateEntity(
      subjectDto,
      this.subjectRepository,
    );

    const existingCategory = await this.classCategoryRepository.findOne({
      where: { level, subject },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Class category ${subject.name} - ${level.name} already exists`,
      );
    }

    const classCategory = this.classCategoryRepository.create({
      level,
      subject,
    });

    const newClassCategory =
      await this.classCategoryRepository.save(classCategory);
    this.dispatchEvent(newClassCategory);

    return newClassCategory;
  }

  private async findOrCreateEntity(
    entityDto: Level | Subject,
    entityRepository: LevelRepository | SubjectRepository,
  ): Promise<Level | Subject> {
    let entity: any;
    if (entityDto?.id) {
      entity = await entityRepository.findOne({ where: { id: entityDto.id } });
      if (!entity) {
        throw new NotFoundException(`Entity with ${entityDto.id} not found`);
      }
    } else if (entityDto?.name) {
      entity = await entityRepository.findOne({
        where: { name: entityDto.name },
      });
      if (!entity) {
        entity = entityRepository.create({ name: entityDto.name });
        entity = await entityRepository.save(entity);
      }
    }
    return entity;
  }

  async dispatchEvent(newClassCategory: ClassCategory) {
    const { id, subject, level } = newClassCategory;
    const eventPayload = Builder<ClassCategoryCreatedEventPayload>()
      .classCategoryId(id)
      .subject(subject)
      .level(level)
      .build();
    const event = new ClassCategoryCreatedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  private transformResults(classCategories: any[]): ReturnedClassCategory[] {
    return classCategories.map(item => this.transformResult(item));
  }

  private transformResult(classCategory: any): ReturnedClassCategory {
    return {
      id: classCategory.classCategory_id,
      slug: classCategory.classCategory_slug,
      subject: {
        id: classCategory.subject_id,
        name: classCategory.subject_name,
      },
      level: {
        id: classCategory.level_id,
        name: classCategory.level_name,
      },
      classCount: classCategory.classCount
    } as ReturnedClassCategory
  }
}
