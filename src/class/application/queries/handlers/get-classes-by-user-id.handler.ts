import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Class } from 'src/class/infrastructure/entities';
import { GetClassesByUserIdQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories'

@QueryHandler(GetClassesByUserIdQuery)
export class GetClassesByUserIdHandler implements IQueryHandler<GetClassesByUserIdQuery> {
    constructor(private readonly classRepository: ClassRepository) { }

    async execute(query: GetClassesByUserIdQuery): Promise<Class[]> {
        const { userId, filters } = query;
        return this.classRepository.findByFieldsWithFilters({
            tutorId: userId,
            studentId: userId,
        }, filters);
    }
}