import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClassStatus } from '@tutorify/shared';
import { Class } from 'src/class/infrastructure/entities';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { ClassEventDispatcher } from '../../class.event-dispatcher';
import { CleanupTestClassesCommand } from '../impl';

@CommandHandler(CleanupTestClassesCommand)
export class CleanupTestClassesHandler
  implements ICommandHandler<CleanupTestClassesCommand> {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classEventDispatcher: ClassEventDispatcher,
  ) { }

  async execute(cmd: CleanupTestClassesCommand) {
    const classesToDelete = await this.classRepository.createQueryBuilder('class')
      .where("class.requirement LIKE 'test%'")
      .andWhere("class.status = :status", { status: ClassStatus.UNASSIGNED })
      .getMany();

    // Store the ids of the classes
    const idsToDelete = classesToDelete.map(_class => _class.id);

    // Then, we delete the classes
    await this.classRepository.createQueryBuilder()
      .delete()
      .from(Class)
      .where("id IN (:...ids)", { ids: idsToDelete })
      .execute();

    idsToDelete.forEach(id => this.classEventDispatcher.dispatchClassDeletedEvent(id));
    return classesToDelete.length;
  }
}
