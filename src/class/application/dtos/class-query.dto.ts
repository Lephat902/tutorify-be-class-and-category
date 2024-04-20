import { IntersectionType } from '@nestjs/mapped-types';
import {
  PaginationDto,
  SortingDirectionDto,
  ClassOrderBy,
  ClassStatus,
  StoredLocation,
  UserMakeRequest,
} from '@tutorify/shared';

export class ClassQueryDto extends IntersectionType(
  PaginationDto,
  SortingDirectionDto
) {
  readonly q: string;
  readonly order: ClassOrderBy;
  readonly ids: string[];
  readonly classCategoryIds: string[];
  userPreferences: {
    classCategoryIds: string[];
    location: StoredLocation;
  };
  readonly subjectIds: string[];
  readonly levelIds: string[];
  readonly includeHidden: boolean;
  readonly statuses: ClassStatus[];
  readonly isOnline: boolean;
  readonly wardId: string;
  readonly districtId: string;
  readonly provinceId: string;
  readonly userIdToGetClasses: string;
  readonly createdAtMin: Date;
  readonly createdAtMax: Date;
  readonly minWage: number;
  readonly maxWage: number;
  // About user
  readonly userMakeRequest: UserMakeRequest;
  // Not user's input
  location: StoredLocation;
}
