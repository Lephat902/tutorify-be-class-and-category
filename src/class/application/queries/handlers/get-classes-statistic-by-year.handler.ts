import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataPresentationOption, StatisticTimeIntervalOption } from '@tutorify/shared';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { GetClassesStatisticByYearQuery } from '../impl';

@QueryHandler(GetClassesStatisticByYearQuery)
export class GetClassesStatisticByYearHandler implements IQueryHandler<GetClassesStatisticByYearQuery> {
  constructor(private readonly classRepository: ClassRepository) { }

  async execute(query: GetClassesStatisticByYearQuery) {
    const { classStatisticDto } = query;
    const { year, timeIntervalOption, statuses, presentationOption, shortMonthName } = classStatisticDto;
    const qb = this.classRepository.createQueryBuilder('class');

    if (timeIntervalOption === StatisticTimeIntervalOption.QUARTER) {
      qb
        .select('EXTRACT(QUARTER FROM class.createdAt) as "timeIntervalIndexNum"')
        .addSelect('\'Q\' || EXTRACT(QUARTER FROM class.createdAt) as "timeIntervalIndex"')
        .addSelect('COUNT(class.id)', 'count')
        .addGroupBy('"timeIntervalIndex"')
        .addGroupBy('"timeIntervalIndexNum"');
    } else {
      const monthNameOption = shortMonthName ? 'Mon' : 'Month';
      qb
        .select(`TRIM(TO_CHAR(class.createdAt, '${monthNameOption}')) as "timeIntervalIndex"`)
        .addSelect('EXTRACT(MONTH FROM class.createdAt) as "timeIntervalIndexNum"')
        .addSelect('COUNT(class.id)', 'count')
        .addGroupBy('"timeIntervalIndex"')
        .addGroupBy('"timeIntervalIndexNum"');
    }

    qb.orderBy('"timeIntervalIndexNum"', "ASC");

    qb.where('EXTRACT(YEAR FROM class.createdAt) = :year', { year });

    this.classRepository.filterByStatuses(qb, statuses);

    let results = await qb.getRawMany();

    if (presentationOption === DataPresentationOption.ACCUMULATION) {
      results = this.accumulateResults(results);
    }

    return results;
  }

  private accumulateResults(results: any[]) {
    return results.reduce((acc, cur, i) => {
      const prev = acc[i - 1] ? parseInt(acc[i - 1].count) : 0;
      const current = parseInt(cur.count);
      cur.count = (prev + current).toString();
      acc.push(cur);
      return acc;
    }, []);
  }
}
