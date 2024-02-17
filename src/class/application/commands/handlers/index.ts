import { CreateClassHandler } from "./create-class.handler";
import { UpdateClassHandler } from "./update-class.handler";
import { DeleteClassByIdHandler } from "./delete-class-by-id.handler";

export const CommandHandlers = [
    CreateClassHandler,
    UpdateClassHandler,
    DeleteClassByIdHandler,
];