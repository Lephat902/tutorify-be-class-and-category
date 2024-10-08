import { ClassStatus, DataPresentationOption, StatisticTimeIntervalOption } from "@tutorify/shared";

export class ClassStatisticByYearDto {
  readonly year: number;
  readonly shortMonthName: boolean;
  readonly timeIntervalOption: StatisticTimeIntervalOption;
  readonly statuses: ClassStatus[];
  readonly presentationOption: DataPresentationOption;
}
