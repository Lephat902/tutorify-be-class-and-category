import { ICommand } from '@nestjs/cqrs';
import { ClassCreateUpdateDto } from '../../dtos';

export class CreateClassSaga implements ICommand {
    constructor(
        public readonly studentId: string,
        public readonly createClassDto: ClassCreateUpdateDto,
    ) { }
}
