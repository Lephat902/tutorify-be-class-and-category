import { ICommand } from '@nestjs/cqrs';

export class CleanupTestClassesCommand implements ICommand {
  constructor() { }
}
