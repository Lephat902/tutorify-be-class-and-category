import { IQuery } from '@nestjs/cqrs';
import { ClassQueryDto } from '../../dtos/class-query.dto';

export class GetClassesQuery implements IQuery {
    constructor(
        public readonly filters: ClassQueryDto,
    ) { }
}