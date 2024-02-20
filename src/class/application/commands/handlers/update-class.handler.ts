import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateClassCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException } from '@nestjs/common';
import { ClassCategoryRepository } from 'src/category/repositories';
import { Class } from 'src/class/infrastructure/entities';
import { validateAndFetchCategories } from './helpers';

@CommandHandler(UpdateClassCommand)
export class UpdateClassHandler implements ICommandHandler<UpdateClassCommand> {
    constructor(
        private readonly classRepository: ClassRepository,
        private readonly classCategoryRepository: ClassCategoryRepository,
    ) { }

    async execute(command: UpdateClassCommand): Promise<Class> {
        const { id, updateClassDto } = command;

        // Fetch the existing class
        const existingClass = await this.classRepository.findOneBy({ id });
        if (!existingClass) {
            throw new BadRequestException('Class not found.');
        }

        // If classCategoryIds are provided, fetch ClassCategory entities
        if (updateClassDto?.classCategoryIds) {
            existingClass.classCategories = await validateAndFetchCategories(this.classCategoryRepository, updateClassDto.classCategoryIds);
        }

        // If isOnline is false, check if address and wardId are provided
        if (updateClassDto?.isOnline === false && (!updateClassDto?.address || !updateClassDto?.wardId)) {
            throw new BadRequestException('Address and wardId are required for offline classes.');
        }

        // If tutorId is provided, ensure that this class has no tutor first
        if (updateClassDto?.tutorId) {
            if (existingClass.tutorId) {
                throw new BadRequestException('This class already has a tutor.');
            }
        }

        // Update the class with the provided data
        const updatedClass = this.classRepository.merge(existingClass, updateClassDto);
        return this.classRepository.save(updatedClass);
    }
}
