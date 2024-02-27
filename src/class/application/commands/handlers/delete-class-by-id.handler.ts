import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteClassByIdCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories'
import { BroadcastService, ClassDeletedEvent, ClassDeletedEventPayload } from '@tutorify/shared';
import { Builder } from 'builder-pattern';

@CommandHandler(DeleteClassByIdCommand)
export class DeleteClassByIdHandler implements ICommandHandler<DeleteClassByIdCommand> {
    constructor(
        private readonly classRepository: ClassRepository,
        private readonly broadcastService: BroadcastService,
    ) { }

    async execute(query: DeleteClassByIdCommand) {
        const { id } = query;
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