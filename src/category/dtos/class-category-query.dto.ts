import { ClassStatus } from "@tutorify/shared";

export class ClassCategoryQueryDto {
    readonly q?: string;
    readonly ids?: string[];
    readonly classStatuses?: ClassStatus[];
    readonly includeHiddenClass?: boolean;
    readonly includeClassCount?: boolean;
    readonly classCreatedAtMin?: Date;
    readonly classCreatedAtMax?: Date;
}