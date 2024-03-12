import { GetClassesByStudentIdHandler } from './get-classes-by-student-id.handler';
import { GetClassesByTutorIdHandler } from './get-classes-by-tutor-id.handler';
import { GetClassesHandler } from './get-classes.handler';
import { GetClassByIdHandler } from './get-class-by-id.handler';
import { GetClassesAndTotalCountHandler } from './get-classes-and-total-count.handler';
import { GetNumberOfClassesByCategoryIdHandler } from './get-number-of-classes-by-category-id.handler';

export const QueryHandlers = [
  GetClassByIdHandler,
  GetClassesHandler,
  GetClassesByStudentIdHandler,
  GetClassesByTutorIdHandler,
  GetClassesAndTotalCountHandler,
  GetNumberOfClassesByCategoryIdHandler,
];
