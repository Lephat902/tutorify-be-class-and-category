import { GenderPref, TutorPositionPref, Weekday } from '@tutorify/shared';

class ClassTimeSlotDto {
  startTime: string;
  endTime: string;
  weekday: Weekday;
}

export class ClassCreateUpdateDto {
  classCategoryIds: string[];
  description: string;
  requirement?: string;
  startDate?: Date;
  endDate?: Date;
  wages?: number;
  address?: string;
  wardId?: string;
  isOnline: boolean;
  studentQty: number;
  tutorPositionPref?: TutorPositionPref;
  tutorGenderPref?: GenderPref;
  timeSlots: ClassTimeSlotDto[];
  tutorId?: string;
  desiredTutorIds: string[];
  imgUrl?: string;
}
