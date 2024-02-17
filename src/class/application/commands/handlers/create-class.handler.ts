import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Class } from 'src/class/infrastructure/entities';
import { CreateClassCommand } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException } from '@nestjs/common';
import { ClassCategoryRepository } from 'src/category/repositories';
import { validateAndFetchCategories } from './helpers';

@CommandHandler(CreateClassCommand)
export class CreateClassHandler implements ICommandHandler<CreateClassCommand> {
    constructor(
        private readonly classRepository: ClassRepository,
        private readonly classCategoryRepository: ClassCategoryRepository,
    ) { }

    async execute(command: CreateClassCommand): Promise<Class> {
        const { studentId, createClassDto } = command;
        const { classCategoryIds, isOnline, address, wardId } = createClassDto;

        // Fetch ClassCategory entities based on the provided classCategoryIds
        const classCategories = await validateAndFetchCategories(this.classCategoryRepository, classCategoryIds);

        // Check if isOnline is false and if address and wardId are provided
        if (isOnline === false && (!address || !wardId)) {
            throw new BadRequestException('Address and wardId are required for offline classes.');
        }

        const newClass = this.classRepository.create({
            studentId,
            classCategories,
            ...createClassDto,
        });
        return this.classRepository.save(newClass);
    }
}