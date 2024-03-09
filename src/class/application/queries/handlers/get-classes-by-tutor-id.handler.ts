import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassesByTutorIdQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';

@QueryHandler(GetClassesByTutorIdQuery)
export class GetClassesByTutorIdHandler
  implements IQueryHandler<GetClassesByTutorIdQuery>
{
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(query: GetClassesByTutorIdQuery) {
    const { tutorId, filters } = query;
    return this.classRepository.findByFieldsWithFilters({ tutorId }, filters, true);
  }
}
