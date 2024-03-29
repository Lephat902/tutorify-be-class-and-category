import { OmitType } from '@nestjs/mapped-types';
import { ClassCreateDto } from './class-create.dto';

export class ClassUpdateDto extends OmitType(ClassCreateDto, [
  'desiredTutorIds',
] as const) {
  tutorId: string;
  isHidden: boolean;
  isAdmin: boolean;
  isSystem: boolean;
  userMakeRequest: string;
}
