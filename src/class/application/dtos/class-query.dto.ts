import { IntersectionType } from '@nestjs/mapped-types';
import {
  PaginationDto,
  SortingDirectionDto,
  ClassOrderBy,
  ClassStatus,
  StoredLocation,
} from '@tutorify/shared';

export class ClassQueryDto extends IntersectionType(
  PaginationDto,
  SortingDirectionDto
) {
  readonly q: string;
  readonly order: ClassOrderBy;
  readonly classCategoryIds: string[] = [];
  userPreferences: {
    classCategoryIds: string[];
    location: StoredLocation;
  };
  readonly subjectIds: string[] = [];
  readonly levelIds: string[] = [];
  readonly includeHidden: boolean;
  readonly statuses: ClassStatus[];
  readonly isOnline: boolean;
  readonly wardId: string;
  readonly districtId: string;
  readonly provinceId: string;
  // About user
  readonly userId: string;
  readonly me: boolean;
  readonly isTutor: boolean;
  readonly isStudent: boolean;
  // Not user's input
  location: StoredLocation;
}
