import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Class } from 'src/class/infrastructure/entities';
import { Injectable } from '@nestjs/common';
import { ClassQueryDto } from 'src/class/application/dtos/class-query.dto';

@Injectable()
export class ClassRepository extends Repository<Class> {
    constructor(private dataSource: DataSource) {
        super(Class, dataSource.createEntityManager());
    }

    async findByFieldsWithFilters(fields: Record<string, any>, filters?: ClassQueryDto): Promise<Class[]> {
        let classQuery = this.createQueryBuilderWithEagerLoading();

        // Filter by fields if provided
        for (const [field, value] of Object.entries(fields)) {
            classQuery = classQuery.andWhere(`class.${field} = :value`, { value });
        }

        // Apply additional filters if provided
        if (filters) {
            classQuery = this.applyAdditionalFilters(classQuery, filters);
        }

        return classQuery.getMany();
    }

    private createQueryBuilderWithEagerLoading(): SelectQueryBuilder<Class> {
        return this.dataSource.createQueryBuilder(Class, 'class')
            .leftJoinAndSelect('class.classCategories', 'classCategories')
            .leftJoinAndSelect('classCategories.subject', 'subject')
            .leftJoinAndSelect('classCategories.level', 'level');
    }

    private applyAdditionalFilters(query: SelectQueryBuilder<Class>, filters: ClassQueryDto) {
        if (filters.classCategoryIds && filters.classCategoryIds.length > 0) {
            query = query.andWhere('classCategories.id IN (:...classCategoryIds)', { classCategoryIds: filters.classCategoryIds });
        }
        if (filters.subjectIds && filters.subjectIds.length > 0) {
            query = query.andWhere('subject.id IN (:...subjectIds)', { subjectIds: filters.subjectIds });
        }
        if (filters.levelIds && filters.levelIds.length > 0) {
            query = query.andWhere('level.id IN (:...levelIds)', { levelIds: filters.levelIds });
        }
        if (filters.q) {
            query = query.andWhere('class.description ILIKE :q', { q: `%${filters.q}%` });
        }
        if (filters.order) {
            query = query.orderBy(`class.${filters.order}`, filters.dir || 'ASC');
        }
        if (filters.page && filters.limit) {
            query = query.skip((filters.page - 1) * filters.limit).take(filters.limit);
        }
        if (!filters.includeHidden) {
            query = query.andWhere('class.isHidden = :isHidden', { isHidden: false });
        }

        return query;
    }
}
