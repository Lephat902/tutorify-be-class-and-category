import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CancelClassByIdCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClassEventDispatcher } from '../../class.event-dispatcher';
import { ClassStatus } from '@tutorify/shared';

@CommandHandler(CancelClassByIdCommand)
export class CancelClassByIdHandler
  implements ICommandHandler<CancelClassByIdCommand>
{
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classEventDispatcher: ClassEventDispatcher,
  ) {}

  async execute(query: CancelClassByIdCommand) {
    const { id } = query;
    const classToCancel = await this.classRepository.findOneBy({ id });
    if (!classToCancel) {
      throw new NotFoundException(`Class with id ${id} not exist`);
    }
    if (classToCancel.status !== ClassStatus.ASSIGNED) {
      throw new BadRequestException(
        "Can only cancel an assigned class",
      );
    }
    await this.classRepository.update(id, {
      status: ClassStatus.CANCELLED,
    });
    this.classEventDispatcher.dispatchClassCancelledEvent(id);
    return true;
  }
}
