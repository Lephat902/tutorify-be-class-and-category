import { IQuery } from '@nestjs/cqrs';
import { ClassQueryDto } from '../../dtos/class-query.dto';

export class GetClassByTutorIdQuery implements IQuery {
    constructor(
        public readonly tutorId: string,
        public readonly filters: ClassQueryDto,
    ) { }
}