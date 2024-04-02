import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateClassCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { ClassCategoryRepository } from 'src/category/repositories';
import { Class } from 'src/class/infrastructure/entities';
import {
  generateClassTitle,
  getGeocodeObject,
  getRandomClassImageURL,
  validateAndFetchCategories,
  validateOnlineStatus,
} from '../../helpers';
import { ClassEventDispatcher } from '../../class.event-dispatcher';
import { AddressProxy } from '../../proxies';
import { ClassCreateDto } from '../../dtos';
import { ClassCategory } from 'src/category/entities';

@CommandHandler(CreateClassCommand)
export class CreateClassHandler implements ICommandHandler<CreateClassCommand> {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classCategoryRepository: ClassCategoryRepository,
    private readonly classEventDispatcher: ClassEventDispatcher,
    private readonly addressProxy: AddressProxy,
  ) { }

  async execute(command: CreateClassCommand): Promise<Class> {
    const { createClassDto } = command;
    const classCategories = await this.fetchClassCategories(createClassDto.classCategoryIds);
    const title = generateClassTitle(classCategories);
    validateOnlineStatus(createClassDto.isOnline, createClassDto.address, createClassDto.wardId);
    const location = await getGeocodeObject(this.addressProxy, createClassDto.address, createClassDto.wardId);
    return this.createClass(createClassDto, classCategories, title, location);
  }

  private async fetchClassCategories(classCategoryIds: string[]): Promise<ClassCategory[]> {
    return await validateAndFetchCategories(this.classCategoryRepository, classCategoryIds);
  }

  private async createClass(
    createClassDto: ClassCreateDto,
    classCategories: ClassCategory[],
    title: string,
    location: Class['location'],
  ): Promise<Class> {
    const newClassData = this.classRepository.create({
      ...createClassDto,
      classCategories,
      title,
      imgUrl: createClassDto.imgUrl || getRandomClassImageURL(),
      location,
    });

    const newClass = await this.classRepository.save(newClassData);
    this.classEventDispatcher.dispatchClassCreatedEvent(newClass.id, createClassDto);
    return newClass;
  }
}