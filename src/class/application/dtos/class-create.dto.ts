import { GenderPref, TutorPositionPref, Weekday } from '@tutorify/shared';

class ClassTimeSlotDto {
  startTime: string;
  endTime: string;
  weekday: Weekday;
}

export class ClassCreateDto {
  studentId: string;
  classCategoryIds: string[];
  description: string;
  requirement: string;
  startDate: Date;
  endDate: Date;
  wages: number;
  address: string;
  wardId: string;
  isOnline: boolean;
  studentQty: number;
  tutorPositionPref: TutorPositionPref;
  tutorGenderPref: GenderPref;
  timeSlots: ClassTimeSlotDto[];
  desiredTutorIds: string[];
  imgUrl: string;
}
