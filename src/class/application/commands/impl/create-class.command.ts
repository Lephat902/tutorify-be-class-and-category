import { ICommand } from '@nestjs/cqrs';
import { ClassCreateUpdateDto } from '../../dtos';

export class CreateClassCommand implements ICommand {
    constructor(
        public readonly studentId: string,
        public readonly createClassDto: ClassCreateUpdateDto,
    ) { }
}
