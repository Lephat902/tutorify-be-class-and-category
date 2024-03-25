import { ICommand } from '@nestjs/cqrs';
import { ClassUpdateDto } from '../../dtos';

export class UpdateClassCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly updateClassDto: ClassUpdateDto,
  ) {}
}
