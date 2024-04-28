import { ClassStatus } from "@tutorify/shared";

export class ClassCategoryQueryDto {
    readonly statuses?: ClassStatus[];
    readonly includeHidden?: boolean;
    readonly includeClassCount?: boolean;
    readonly classCreatedAtMin?: Date;
    readonly classCreatedAtMax?: Date;
}