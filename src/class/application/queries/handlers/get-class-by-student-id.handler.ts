import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Class } from 'src/class/infrastructure/entities';
import { GetClassByStudentIdQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories'

@QueryHandler(GetClassByStudentIdQuery)
export class GetClassByStudentIdHandler implements IQueryHandler<GetClassByStudentIdQuery> {
    constructor(private readonly classRepository: ClassRepository) { }

    async execute(query: GetClassByStudentIdQuery): Promise<Class[]> {
        const { studentId, filters } = query;
        console.log(query);
        return this.classRepository.findByFieldWithFilters('studentId', studentId, filters);
    }
}