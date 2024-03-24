import { IntersectionType } from '@nestjs/mapped-types';
import {
  PaginationDto,
  SortingDirectionDto,
  ClassOrderBy,
} from '@tutorify/shared';

export class ClassQueryDto extends IntersectionType(
  PaginationDto,
  SortingDirectionDto
) {
  readonly q: string;
  readonly order: ClassOrderBy;
  readonly classCategoryIds: string[] = [];
  tutorPreferences: {
    classCategoryIds: string[];
  };
  readonly subjectIds: string[] = [];
  readonly levelIds: string[] = [];
  readonly includeHidden: boolean;
  readonly isAssigned: boolean;
  readonly userId: string;
  readonly me: boolean;
  readonly isTutor: boolean;
  readonly isStudent: boolean;
}
