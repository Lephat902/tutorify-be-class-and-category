import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteClassByIdCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories'
import { BroadcastService, ClassDeletedEvent, ClassDeletedEventPayload } from '@tutorify/shared';
import { Builder } from 'builder-pattern';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteClassByIdCommand)
export class DeleteClassByIdHandler implements ICommandHandler<DeleteClassByIdCommand> {
    constructor(
        private readonly classRepository: ClassRepository,
        private readonly broadcastService: BroadcastService,
    ) { }

    async execute(query: DeleteClassByIdCommand) {
        const { id } = query;
        const classToDelete = await this.classRepository.findOneBy({id});
        if (!classToDelete) {
            throw new NotFoundException(`Class with id ${id} not exist`);
        }
        if (classToDelete.tutorId) {
            throw new BadRequestException(`Class is settled! If you mean to cancel this class, contact the manager of the system`);
        }
        await this.classRepository.delete(id);
        this.dispatchEvent(id);
        return true;
    }

    async dispatchEvent(id: string) {
        const eventPayload = Builder<ClassDeletedEventPayload>()
            .classId(id)
            .build();
        const event = new ClassDeletedEvent(eventPayload);
        this.broadcastService.broadcastEventToAllMicroservices(event.pattern, event.payload);
    }
}