import { ICommand } from '@nestjs/cqrs';

export class CancelClassByIdCommand implements ICommand {
  constructor(public readonly id: string) {}
}
