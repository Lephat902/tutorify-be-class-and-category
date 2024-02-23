import { IQuery } from '@nestjs/cqrs';
import { ClassQueryDto } from '../../dtos/class-query.dto';

export class GetClassesByUserIdQuery implements IQuery {
    constructor(
        public readonly userId: string,
        public readonly filters: ClassQueryDto
    ) { }
}