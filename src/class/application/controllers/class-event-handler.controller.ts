import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ClassService } from '../class.service';
import {
  ApplicationStatus,
  ClassApplicationUpdatedEventPattern,
  ClassApplicationUpdatedEventPayload,
  ClassSessionDefaultAddressQueryEventPattern,
  ClassSessionDefaultAddressQueryEventPayload,
} from '@tutorify/shared';
import { ClassEventDispatcher } from '../class.event-dispatcher';
import { ClassUpdateDto } from '../dtos';

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

  private async returnDefaultAddress(
    classSessionId: string,
    classId: string,
  ) {
    const classToGetAddress =
      await this.classService.getClassById(classId);
    this.eventDispatcher.dispatchClassSessionDefaultAddressReturned(classSessionId, classToGetAddress);
  }
}
