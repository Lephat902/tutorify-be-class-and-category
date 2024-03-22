import {
  PaginationDto,
  SortingDirectionDto,
  applyMixins,
  ClassOrderBy,
} from '@tutorify/shared';

class ClassQueryDto {
  readonly q?: string;
  readonly order?: ClassOrderBy;
  readonly classCategoryIds?: string[];
  readonly subjectIds?: string[];
  readonly levelIds?: string[];
  readonly includeHidden?: boolean;
  readonly isAssigned?: boolean;
  readonly userId?: boolean;
}

interface ClassQueryDto extends PaginationDto, SortingDirectionDto {}
applyMixins(ClassQueryDto, [PaginationDto, SortingDirectionDto]);

export { ClassQueryDto };
