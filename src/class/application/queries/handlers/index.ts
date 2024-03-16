import { GetClassByIdHandler } from './get-class-by-id.handler';
import { GetClassesAndTotalCountHandler } from './get-classes-and-total-count.handler';
import { GetNumberOfClassesByCategoryIdHandler } from './get-number-of-classes-by-category-id.handler';

export const QueryHandlers = [
  GetClassByIdHandler,
  GetClassesAndTotalCountHandler,
  GetNumberOfClassesByCategoryIdHandler,
];
