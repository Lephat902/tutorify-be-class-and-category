import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Subject } from '../entities';

@Injectable()
export class SubjectRepository extends Repository<Subject> {
    constructor(private dataSource: DataSource) {
        super(Subject, dataSource.createEntityManager());
    }
}
