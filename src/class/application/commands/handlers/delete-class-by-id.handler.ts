import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteClassByIdCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClassEventDispatcher } from '../../class.event-dispatcher';

@CommandHandler(DeleteClassByIdCommand)
export class DeleteClassByIdHandler
  implements ICommandHandler<DeleteClassByIdCommand>
{
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classEventDispatcher: ClassEventDispatcher,
  ) {}

  async execute(query: DeleteClassByIdCommand) {
    const { id } = query;
    const classToDelete = await this.classRepository.findOneBy({ id });
    if (!classToDelete) {
      throw new NotFoundException(`Class with id ${id} not exist`);
    }
    if (classToDelete.tutorId) {
      throw new BadRequestException(
        `Class is settled! If you mean to cancel this class, contact the manager of the system`,
      );
    }
    await this.classRepository.delete(id);
    this.classEventDispatcher.dispatchClassDeletedEvent(id);
    return true;
  }
}
