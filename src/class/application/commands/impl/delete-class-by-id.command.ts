import { ICommand } from '@nestjs/cqrs';

export class DeleteClassByIdCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly userMakeRequest: string,
  ) { }
}
