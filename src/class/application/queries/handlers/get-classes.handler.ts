import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassesQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';

@QueryHandler(GetClassesQuery)
export class GetClassesHandler implements IQueryHandler<GetClassesQuery> {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(query: GetClassesQuery) {
    const { filters } = query;
    return this.classRepository.findByFieldsWithFilters({}, filters, false);
  }
}
