import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberOfClassesByCategoryIdQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';

@QueryHandler(GetNumberOfClassesByCategoryIdQuery)
export class GetNumberOfClassesByCategoryIdHandler implements IQueryHandler<GetNumberOfClassesByCategoryIdQuery> {
  constructor(private readonly classRepository: ClassRepository) {}

  async execute(query: GetNumberOfClassesByCategoryIdQuery) {
    const { classCategoryId } = query;
    return this.classRepository.getNumberOfClassesByCategoryId(classCategoryId);
  }
}
