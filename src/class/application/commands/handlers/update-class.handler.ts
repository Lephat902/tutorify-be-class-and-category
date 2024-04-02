import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateClassCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ClassCategoryRepository } from 'src/category/repositories';
import { Class } from 'src/class/infrastructure/entities';
import { generateClassTitle, getGeocodeObject, validateAndFetchCategories, validateOnlineStatus } from '../../helpers';
import { ClassEventDispatcher } from '../../class.event-dispatcher';
import { ClassStatus } from '@tutorify/shared';
import { AddressProxy } from '../../proxies';
import { ClassUpdateDto } from '../../dtos';

@CommandHandler(UpdateClassCommand)
export class UpdateClassHandler implements ICommandHandler<UpdateClassCommand> {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly classCategoryRepository: ClassCategoryRepository,
    private readonly classEventDispatcher: ClassEventDispatcher,
    private readonly addressProxy: AddressProxy,
  ) { }

  async execute(command: UpdateClassCommand): Promise<Class> {
    const { id, updateClassDto } = command;
    const existingClass = await this.fetchExistingClass(id);
    this.validateUpdate(existingClass, updateClassDto);

    this.updateClassStatus(existingClass, updateClassDto.tutorId);
    await this.updateClassCategories(existingClass, updateClassDto.classCategoryIds);
    await this.updateClassLocation(existingClass, updateClassDto.address, updateClassDto.wardId);

    return this.saveUpdatedClass(existingClass, updateClassDto, id);
  }

  private async fetchExistingClass(id: string): Promise<Class> {
    const existingClass = await this.classRepository.findOneBy({ id });
    if (!existingClass) {
      throw new BadRequestException('Class not found.');
    }
    return existingClass;
  }

  private validateUpdate(existingClass: Class, updateClassDto: ClassUpdateDto) {
    const { isSystem, isAdmin, userMakeRequest, isOnline, address, wardId } = updateClassDto;
    if (!isSystem && !isAdmin && existingClass.studentId !== userMakeRequest) {
      throw new ForbiddenException("This class is not yours");
    }
    if (existingClass.status === ClassStatus.CANCELLED) {
      throw new BadRequestException("Cannot modify a cancelled class!");
    }
    validateOnlineStatus(isOnline, address, wardId);
    if (updateClassDto?.tutorId && existingClass.tutorId) {
      throw new BadRequestException('This class already has a tutor.');
    }
  }

  private updateClassStatus(existingClass: Class, tutorId: string) {
    if (tutorId) {
      existingClass.status = ClassStatus.ASSIGNED;
    }
  }

  private async updateClassCategories(existingClass: Class, classCategoryIds: string[]) {
    if (classCategoryIds) {
      existingClass.classCategories = await validateAndFetchCategories(
        this.classCategoryRepository,
        classCategoryIds,
      );
      existingClass.title = generateClassTitle(existingClass.classCategories);
    }
  }

  private async updateClassLocation(existingClass: Class, address: string, wardId: string) {
    existingClass.location = await getGeocodeObject(this.addressProxy, address, wardId);
  }

  private async saveUpdatedClass(existingClass: Class, updateClassDto: ClassUpdateDto, id: string): Promise<Class> {
    const updatedClassData = this.classRepository.merge(existingClass, updateClassDto);
    const updatedClass = await this.classRepository.save(updatedClassData);
    this.classEventDispatcher.dispatchClassUpdatedEvent(id);
    return updatedClass;
  }
}
