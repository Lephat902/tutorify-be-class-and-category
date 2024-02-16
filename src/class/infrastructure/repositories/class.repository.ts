import { DataSource, Repository } from 'typeorm';
import { Class } from 'src/class/infrastructure/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassRepository extends Repository<Class> {
    constructor(private dataSource: DataSource) {
        super(Class, dataSource.createEntityManager());
    }

    async findByFieldWithFilters(field: string, value: string, filters: any): Promise<Class[]> {
        let classQuery = this.createQueryBuilder('class');

        // Filter by field
        classQuery = classQuery.where(`class.${field} = :value`, { value });

        // Apply additional filters if provided
        if (filters) {
            if (filters.q) {
                classQuery = classQuery.andWhere('class.description ILIKE :q', { q: `%${filters.q}%` });
            }
            if (filters.order) {
                classQuery = classQuery.orderBy(`class.${filters.order}`, filters.dir || 'ASC');
            }
            if (filters.page && filters.limit) {
                classQuery = classQuery.skip((filters.page - 1) * filters.limit).take(filters.limit);
            }
        }

        return classQuery.getMany();
    }
}
