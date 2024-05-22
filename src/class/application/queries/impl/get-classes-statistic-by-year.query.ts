import { IQuery } from '@nestjs/cqrs';
import { ClassStatisticDto } from '../../dtos';

export class GetClassesStatisticByYearQuery implements IQuery {
  constructor(public readonly classStatisticDto: ClassStatisticDto) {}
}
