import { GetClassesByStudentIdHandler } from './get-classes-by-student-id.handler';
import { GetClassesByTutorIdHandler } from './get-classes-by-tutor-id.handler';
import { GetClassesHandler } from './get-classes.handler';
import { GetClassByIdHandler } from './get-class-by-id.handler';

export const QueryHandlers = [
  GetClassByIdHandler,
  GetClassesHandler,
  GetClassesByStudentIdHandler,
  GetClassesByTutorIdHandler,
];
