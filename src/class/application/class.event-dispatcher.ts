import {
  BroadcastService,
  ClassCancelledEvent,
  ClassCancelledEventPayload,
  ClassCreatedEvent,
  ClassCreatedEventPayload,
  ClassDeletedEvent,
  ClassDeletedEventPayload,
  ClassSessionClassVerifiedEvent,
  ClassSessionClassVerifiedEventPayload,
  ClassSessionTutorVerifiedEvent,
  ClassSessionTutorVerifiedEventPayload,
  ClassUpdatedEvent,
  ClassUpdatedEventPayload,
} from '@tutorify/shared';
import { Builder } from 'builder-pattern';
import { Injectable } from '@nestjs/common';
import { ClassCreateDto } from './dtos';

@Injectable()
export class ClassEventDispatcher {
  constructor(private readonly broadcastService: BroadcastService) {}

  dispatchClassSessionTutorVerified(
    classSessionId: string,
    isValidTutor: boolean,
  ) {
    const eventPayload = Builder<ClassSessionTutorVerifiedEventPayload>()
      .classSessionId(classSessionId)
      .isValidTutor(isValidTutor)
      .build();
    const event = new ClassSessionTutorVerifiedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  dispatchClassSessionClassVerified(
    classSessionId: string,
    isValidClass: boolean,
  ) {
    const eventPayload = Builder<ClassSessionClassVerifiedEventPayload>()
      .classSessionId(classSessionId)
      .isValidClass(isValidClass)
      .build();
    const event = new ClassSessionClassVerifiedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  dispatchClassCreatedEvent(
    classId: string,
    createClassDto: ClassCreateDto,
  ) {
    const eventPayload = Builder<ClassCreatedEventPayload>()
      .classId(classId)
      .desiredTutorIds(createClassDto?.desiredTutorIds)
      .build();
    const event = new ClassCreatedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  dispatchClassDeletedEvent(id: string) {
    const eventPayload = Builder<ClassDeletedEventPayload>()
      .classId(id)
      .build();
    const event = new ClassDeletedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  dispatchClassCancelledEvent(id: string) {
    const eventPayload = Builder<ClassCancelledEventPayload>()
      .classId(id)
      .build();
    const event = new ClassCancelledEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }

  dispatchClassUpdatedEvent(id: string) {
    const eventPayload = Builder<ClassUpdatedEventPayload>()
      .classId(id)
      .build();
    const event = new ClassUpdatedEvent(eventPayload);
    this.broadcastService.broadcastEventToAllMicroservices(
      event.pattern,
      event.payload,
    );
  }
}
