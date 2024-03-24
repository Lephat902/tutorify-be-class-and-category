import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassesAndTotalCountQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';

@QueryHandler(GetClassesAndTotalCountQuery)
export class GetClassesAndTotalCountHandler implements IQueryHandler<GetClassesAndTotalCountQuery> {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(query: GetClassesAndTotalCountQuery) {
    const { filters } = query;
    return this.classRepository.findByFieldsWithFilters(filters);
  }
}
