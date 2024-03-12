import { IQuery } from '@nestjs/cqrs';

export class GetNumberOfClassesByCategoryIdQuery implements IQuery {
  constructor(public readonly classCategoryId: string) {}
}