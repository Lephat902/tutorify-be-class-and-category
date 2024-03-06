import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassesByTutorIdQuery } from '../impl';
import { Class } from 'src/class/infrastructure/entities';
import { ClassRepository } from 'src/class/infrastructure/repositories';

@QueryHandler(GetClassesByTutorIdQuery)
export class GetClassesByTutorIdHandler
  implements IQueryHandler<GetClassesByTutorIdQuery>
{
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(query: GetClassesByTutorIdQuery): Promise<Class[]> {
    const { tutorId, filters } = query;
    return this.classRepository.findByFieldsWithFilters({ tutorId }, filters);
  }
}
