import { IQuery } from '@nestjs/cqrs';
import { ClassStatisticByYearDto } from '../../dtos';

export class GetClassesStatisticByYearQuery implements IQuery {
  constructor(public readonly classStatisticDto: ClassStatisticByYearDto) {}
}
