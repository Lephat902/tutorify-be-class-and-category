import { IQuery } from '@nestjs/cqrs';
import { ClassQueryDto } from '../../dtos/class-query.dto';

export class GetClassesByStudentIdQuery implements IQuery {
    constructor(
        public readonly studentId: string,
        public readonly filters: ClassQueryDto
    ) { }
}