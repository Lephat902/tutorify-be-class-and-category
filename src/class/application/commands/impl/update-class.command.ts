import { ICommand } from '@nestjs/cqrs';
import { ClassCreateUpdateDto } from '../../dtos';

export class UpdateClassCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly updateClassDto: Partial<ClassCreateUpdateDto>,
    ) { }
}
