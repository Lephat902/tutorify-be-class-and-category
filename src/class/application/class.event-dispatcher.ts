import {
    BroadcastService,
    ClassSessionClassVerifiedEvent,
    ClassSessionClassVerifiedEventPayload,
    ClassSessionTutorVerifiedEvent,
    ClassSessionTutorVerifiedEventPayload,
} from '@tutorify/shared';
import { Builder } from 'builder-pattern';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassEventDispatcher {
    constructor(private readonly broadcastService: BroadcastService) { }

    dispatchClassSessionTutorVerified(classSessionId: string, isValidTutor: boolean) {
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

    dispatchClassSessionClassVerified(classSessionId: string, isValidClass: boolean) {
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
}
