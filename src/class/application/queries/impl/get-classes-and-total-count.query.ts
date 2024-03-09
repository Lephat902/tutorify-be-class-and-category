import { IQuery } from '@nestjs/cqrs';
import { ClassQueryDto } from '../../dtos/class-query.dto';

export class GetClassesAndTotalCountQuery implements IQuery {
  constructor(public readonly filters: ClassQueryDto) {}
}
