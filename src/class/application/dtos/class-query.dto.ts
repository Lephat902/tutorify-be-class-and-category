import { PaginationDto, SortingDirectionDto , applyMixins } from '@tutorify/shared';
import { ClassOrderBy } from './enums';

class ClassQueryDto {
    readonly q?: string;
    readonly order?: ClassOrderBy;
}

interface ClassQueryDto extends PaginationDto, SortingDirectionDto { }
applyMixins(ClassQueryDto, [PaginationDto, SortingDirectionDto]);

export { ClassQueryDto };