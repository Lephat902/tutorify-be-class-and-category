import { ICommand } from '@nestjs/cqrs';

export class DeleteClassCommand implements ICommand {
    constructor(
        public readonly id: string,
    ) { }
}
