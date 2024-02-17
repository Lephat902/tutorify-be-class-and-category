import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Class } from 'src/class/infrastructure/entities';
import { GetClassesByStudentIdQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories'

@QueryHandler(GetClassesByStudentIdQuery)
export class GetClassesByStudentIdHandler implements IQueryHandler<GetClassesByStudentIdQuery> {
    constructor(private readonly classRepository: ClassRepository) { }

    async execute(query: GetClassesByStudentIdQuery): Promise<Class[]> {
        const { studentId, filters } = query;
        return this.classRepository.findByFieldsWithFilters({ studentId }, filters);
    }
}