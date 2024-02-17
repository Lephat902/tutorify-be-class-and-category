import { PaginationDto, SortingDirectionDto , applyMixins } from '@tutorify/shared';
import { ClassOrderBy } from './enums';

class ClassQueryDto {
    readonly q?: string;
    readonly order?: ClassOrderBy;
    readonly classCategoryIds?: string[];
    readonly subjectIds?: string[];
    readonly levelIds?: string[];
    readonly includeHidden?: boolean;
}

interface ClassQueryDto extends PaginationDto, SortingDirectionDto { }
applyMixins(ClassQueryDto, [PaginationDto, SortingDirectionDto]);

export { ClassQueryDto };