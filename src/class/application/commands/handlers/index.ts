import { UpdateClassHandler } from './update-class.handler';
import { DeleteClassByIdHandler } from './delete-class-by-id.handler';
import { CreateClassHandler } from './create-class.handler';
import { CancelClassByIdHandler } from './cancel-class-by-id.handler';
import { CleanupTestClassesHandler } from './cleanup-test-classes.handler';

export const CommandHandlers = [
  UpdateClassHandler,
  CreateClassHandler,
  DeleteClassByIdHandler,
  CancelClassByIdHandler,
  CleanupTestClassesHandler,
];
