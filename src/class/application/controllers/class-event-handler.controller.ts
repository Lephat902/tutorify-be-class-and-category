import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ClassService } from '../class.service';
import {
  ApplicationStatus,
  ClassApplicationUpdatedEventPattern,
  ClassApplicationUpdatedEventPayload,
  ClassSessionCreatedEventPattern,
  ClassSessionCreatedEventPayload,
  MultipleClassSessionsCreatedEventPattern,
  MultipleClassSessionsCreatedEventPayload,
} from '@tutorify/shared';
import { ClassEventDispatcher } from '../class.event-dispatcher';

@Controller()
export class ClassEventHandlerController {
  constructor(
    private readonly classService: ClassService,
    private readonly eventDispatcher: ClassEventDispatcher,
  ) {}

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
    });
  }

  @EventPattern(new ClassSessionCreatedEventPattern())
  async handleClassSessionCreated(payload: ClassSessionCreatedEventPayload) {
    const { classId, classSessionId, createSessionTutorId } = payload;
    const classToInsertClassSession =
      await this.classService.getClassById(classId);
    const isValidClass = !!classToInsertClassSession;
    const isValidTutor =
      classToInsertClassSession.tutorId === createSessionTutorId;
    this.eventDispatcher.dispatchClassSessionClassVerified(
      classSessionId,
      isValidClass,
    );
    this.eventDispatcher.dispatchClassSessionTutorVerified(
      classSessionId,
      isValidTutor,
    );
  }

  @EventPattern(new MultipleClassSessionsCreatedEventPattern())
  async handleMultipleClassSessionsCreated(
    payload: MultipleClassSessionsCreatedEventPayload,
  ) {
    const { classId, createSessionTutorId, classSessionIds } = payload;
    const classToInsertClassSession =
      await this.classService.getClassById(classId);
    const isValidClass = !!classToInsertClassSession;
    const isValidTutor =
      classToInsertClassSession.tutorId === createSessionTutorId;
    for (const classSessionId of classSessionIds) {
      this.eventDispatcher.dispatchClassSessionClassVerified(
        classSessionId,
        isValidClass,
      );
      this.eventDispatcher.dispatchClassSessionTutorVerified(
        classSessionId,
        isValidTutor,
      );
    }
  }
}
