import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ClassService } from '../class.service';
import {
  ApplicationStatus,
  ClassApplicationUpdatedEventPattern,
  ClassApplicationUpdatedEventPayload,
  ClassSessionPendingCreatedEventPattern,
  ClassSessionPendingCreatedEventPayload,
  ClassSessionDefaultAddressQueryEventPattern,
  ClassSessionDefaultAddressQueryEventPayload,
  ClassSessionPendingUpdatedEventPattern,
  ClassSessionPendingUpdatedEventPayload,
  ClassStatus,
} from '@tutorify/shared';
import { ClassEventDispatcher } from '../class.event-dispatcher';
import { ClassUpdateDto } from '../dtos';
import { Class } from 'src/class/infrastructure/entities';

@Controller()
export class ClassEventHandlerController {
  constructor(
    private readonly classService: ClassService,
    private readonly eventDispatcher: ClassEventDispatcher,
  ) { }

  @EventPattern(new ClassApplicationUpdatedEventPattern())
  async handleClassApplicationUpdated(
    payload: ClassApplicationUpdatedEventPayload,
  ) {
    const { classId, tutorId, newStatus } = payload;
    if (newStatus !== ApplicationStatus.APPROVED) {
      return;
    }
    await this.classService.updateClass(classId, {
      tutorId,
      isSystem: true, // use this flag to bypass authorization check
    } as ClassUpdateDto);
  }

  @EventPattern(new ClassSessionDefaultAddressQueryEventPattern())
  async handleClassSessionDefaultAddressQuery(payload: ClassSessionDefaultAddressQueryEventPayload) {
    const { classId, classSessionId } = payload;
    await this.returnDefaultAddress(classSessionId, classId);
  }

  @EventPattern(new ClassSessionPendingCreatedEventPattern())
  async handleClassSessionCreated(payload: ClassSessionPendingCreatedEventPayload) {
    const { classId, classSessionId, createSessionTutorId } = payload;
    await this.validateClassSessionChanges(classSessionId, classId, createSessionTutorId);
  }

  @EventPattern(new ClassSessionPendingUpdatedEventPattern())
  async handleClassSessionUpdated(payload: ClassSessionPendingUpdatedEventPayload) {
    const { classSessionId, updateSessionTutorId, classId } = payload;
    await this.validateClassSessionChanges(classSessionId, classId, updateSessionTutorId);
  }

  private async validateClassSessionChanges(
    classSessionId: string,
    classId: string,
    tutorId: string,
  ) {
    const classToVerifyTutorAndClassAndClass =
      await this.classService.getClassById(classId);
    const isValidClass = this.isValidClassToCreateSession(classToVerifyTutorAndClassAndClass);
    const isValidTutor = this.isValidTutorToManipulateSession(classToVerifyTutorAndClassAndClass, tutorId);
    this.eventDispatcher.dispatchClassSessionClassVerified(
      classSessionId,
      isValidClass,
    );
    this.eventDispatcher.dispatchClassSessionTutorVerified(
      classSessionId,
      isValidTutor,
    );
  }

  private isValidClassToCreateSession(cl: Class) {
    return !!cl && cl.status === ClassStatus.ASSIGNED;
  }

  private isValidTutorToManipulateSession(cl: Class, createSessionTutorId: string) {
    return cl.tutorId === createSessionTutorId;
  }

  private async returnDefaultAddress(
    classSessionId: string,
    classId: string,
  ) {
    const classToGetAddress =
      await this.classService.getClassById(classId);
    this.eventDispatcher.dispatchClassSessionDefaultAddressReturned(classSessionId, classToGetAddress);
  }
}
