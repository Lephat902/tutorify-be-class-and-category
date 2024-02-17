import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteClassByIdCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories'

@CommandHandler(DeleteClassByIdCommand)
export class DeleteClassByIdHandler implements ICommandHandler<DeleteClassByIdCommand> {
    constructor(private readonly classRepository: ClassRepository) { }

    async execute(query: DeleteClassByIdCommand) {
        const { id } = query;
        await this.classRepository.delete(id);
        return true;
    }
}