import { UpdateClassHandler } from './update-class.handler';
import { DeleteClassByIdHandler } from './delete-class-by-id.handler';
import { CreateClassHandler } from './create-class.handler';

export const CommandHandlers = [
  UpdateClassHandler,
  CreateClassHandler,
  DeleteClassByIdHandler,
];
