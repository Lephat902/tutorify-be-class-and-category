import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClassCategory } from '../entities';

@Injectable()
export class ClassCategoryRepository extends Repository<ClassCategory> {
    constructor(private dataSource: DataSource) {
        super(ClassCategory, dataSource.createEntityManager());
    }
}
