import {
  BroadcastService,
  ClassCancelledEvent,
  ClassCancelledEventPayload,
  ClassCreatedEvent,
  ClassCreatedEventPayload,
  ClassDeletedEvent,
  ClassDeletedEventPayload,
  ClassSessionDefaultAddressReturnedEvent,
  ClassSessionDefaultAddressReturnedEventPayload,
  ClassUpdatedEvent,
  ClassUpdatedEventPayload,
} from '@tutorify/shared';
import { Builder } from 'builder-pattern';
import { Injectable } from '@nestjs/common';
import { ClassCreateDto } from './dtos';
import { Class } from '../infrastructure/entities';

@Injectable()
export class ClassEventDispatcher {
  constructor(private readonly broadcastService: BroadcastService) {}

  dispatchClassSessionDefaultAddressReturned(
    classSessionId: string,
    cl: Class,
  ) {
    const eventPayload = Builder<ClassSessionDefaultAddressReturnedEventPayload>()
      .classSessionId(classSessionId)
      .isOnline(cl.isOnline)
      .address(cl.address)
      .wardId(cl.wardId)
      .build();
    const event = new ClassSessionDefaultAddressReturnedEvent(eventPayload);
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
      .studentId(createClassDto.studentId)
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
