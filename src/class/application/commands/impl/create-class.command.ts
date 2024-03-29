import { ICommand } from '@nestjs/cqrs';
import { ClassCreateDto } from '../../dtos';

export class CreateClassCommand implements ICommand {
  constructor(
    public readonly createClassDto: ClassCreateDto,
  ) {}
}
