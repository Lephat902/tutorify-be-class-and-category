import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteClassByIdCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ClassEventDispatcher } from '../../class.event-dispatcher';
import { ClassStatus } from '@tutorify/shared';

@CommandHandler(DeleteClassByIdCommand)
export class DeleteClassByIdHandler
  implements ICommandHandler<DeleteClassByIdCommand>
{
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classEventDispatcher: ClassEventDispatcher,
  ) {}

  async execute(cmd: DeleteClassByIdCommand) {
    const { id, userMakeRequest } = cmd;
    const classToDelete = await this.classRepository.findOneBy({ id });
    if (!classToDelete) {
      throw new NotFoundException(`Class with id ${id} not exist`);
    }
    if (classToDelete.studentId !== userMakeRequest) {
      throw new ForbiddenException("This class is not yours");
    }
    if (classToDelete.status === ClassStatus.ASSIGNED) {
      throw new BadRequestException(
        `Class is settled! If you mean to cancel this class, contact the manager of the system for support`,
      );
    }
    await this.classRepository.delete(id);
    this.classEventDispatcher.dispatchClassDeletedEvent(id);
    return true;
  }
}
