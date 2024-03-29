import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateClassCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException } from '@nestjs/common';
import { ClassCategoryRepository } from 'src/category/repositories';
import { Class } from 'src/class/infrastructure/entities';
import {
  generateClassTitle,
  getRandomClassImageURL,
  validateAndFetchCategories,
} from '../../helpers';
import { ClassEventDispatcher } from '../../class.event-dispatcher';

@CommandHandler(CreateClassCommand)
export class CreateClassHandler implements ICommandHandler<CreateClassCommand> {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classCategoryRepository: ClassCategoryRepository,
    private readonly classEventDispatcher: ClassEventDispatcher,
  ) { }

  async execute(command: CreateClassCommand): Promise<Class> {
    const { createClassDto } = command;
    const { studentId, classCategoryIds, isOnline, address, wardId, imgUrl } =
      createClassDto;

    // Fetch ClassCategory entities based on the provided classCategoryIds
    const classCategories = await validateAndFetchCategories(
      this.classCategoryRepository,
      classCategoryIds,
    );

    // Generate the title based on the first class category
    const title = generateClassTitle(classCategories);

    // Check if isOnline is false and if address and wardId are provided
    if (isOnline === false && (!address || !wardId)) {
      throw new BadRequestException(
        'Address and wardId are required for offline classes.',
      );
    }

    const newClassData = this.classRepository.create({
      ...createClassDto,
      studentId,
      classCategories,
      title,
      imgUrl: imgUrl || getRandomClassImageURL(),
    });

    const newClass = await this.classRepository.save(newClassData);

    this.classEventDispatcher.dispatchClassCreatedEvent(
      newClass.id,
      createClassDto,
    );

    return newClass;
  }
}
