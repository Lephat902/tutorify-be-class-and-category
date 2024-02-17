import { GenderPref, TutorPositionPref } from './enums';

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
}
