import { Class } from 'src/class/infrastructure/entities';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { BadRequestException, Inject } from '@nestjs/common';
import { ClassCategoryRepository } from 'src/category/repositories';
import { validateAndFetchCategories } from '../../helpers';
import { ClientProxy } from '@nestjs/microservices';
import { BroadcastService, ClassCreatedEvent, ClassCreatedEventPayload, DesignateTutorsToClassDto, QueueNames } from '@tutorify/shared';
import { firstValueFrom } from 'rxjs';
import { Builder as SagaBuilder, Saga } from 'nestjs-saga';
import { CreateClassSaga } from '../impl';
import { Builder } from 'builder-pattern';

// If step throws error then compensation chain is started in a reverse order:
// step1 -> step2 -> step3(X) -> compensation2 -> compensation1

@Saga(CreateClassSaga)
export class CreateClassSagaHandler {
    constructor(
        private readonly classRepository: ClassRepository,
        private readonly classCategoryRepository: ClassCategoryRepository,
        @Inject(QueueNames.TUTOR_APPLY_FOR_CLASS)
        private readonly client: ClientProxy,
        private readonly broadcastService: BroadcastService,
    ) { }
    private savedClass: Class;

    saga = new SagaBuilder<CreateClassSaga, Class>()

        .step('Validate and insert class')
        .invoke(this.step1)
        .withCompensation(this.step1Compensation)

        .step('Insert desired tutors')
        .invoke(this.step2)

        .step('Dispatch class-created event')
        .invoke(this.step3)

        .return(this.buildResult)

        .build();

    async step1(cmd: CreateClassSaga) {
        const { studentId, createClassDto } = cmd;
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
        this.savedClass = await this.classRepository.save(newClass);
    }

    async step2(cmd: CreateClassSaga) {
        const { createClassDto } = cmd;
        if (createClassDto?.desiredTutorIds) {
            const designateTutorsDto: DesignateTutorsToClassDto = {
                classId: this.savedClass.id,
                tutorIds: createClassDto.desiredTutorIds,
            }
            await firstValueFrom(this.client.send({ cmd: 'designateTutors' }, designateTutorsDto));
        }
    }

    step3(cmd: CreateClassSaga) {
        const eventPayload = Builder<ClassCreatedEventPayload>()
            .classId(this.savedClass.id)
            .build();
        const event = new ClassCreatedEvent(eventPayload);
        this.broadcastService.broadcastEventToAllMicroservices(event.pattern, event.payload);
    }

    async step1Compensation(cmd: CreateClassSaga) {
        await this.classRepository.delete(this.savedClass.id);
    }

    buildResult(cmd: CreateClassSaga): Class {
        return this.savedClass;
    }
}