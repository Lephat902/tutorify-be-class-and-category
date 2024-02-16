import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassByTutorIdQuery } from '../impl';
import { Class } from 'src/class/infrastructure/entities';
import { ClassRepository } from 'src/class/infrastructure/repositories';

@QueryHandler(GetClassByTutorIdQuery)
export class GetClassByTutorIdHandler implements IQueryHandler<GetClassByTutorIdQuery> {
    constructor(private readonly classRepository: ClassRepository) { }

    async execute(query: GetClassByTutorIdQuery): Promise<Class[]> {
        const { tutorId, filters } = query;
        console.log(tutorId);
        return this.classRepository.findByFieldWithFilters('tutorId', tutorId, filters);
    }
}