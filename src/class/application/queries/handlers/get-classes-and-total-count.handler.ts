import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassesAndTotalCountQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { UserPreferencesProxy } from '../../proxies';

@QueryHandler(GetClassesAndTotalCountQuery)
export class GetClassesAndTotalCountHandler implements IQueryHandler<GetClassesAndTotalCountQuery> {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userPreferencesProxy: UserPreferencesProxy,
  ) { }

  async execute(query: GetClassesAndTotalCountQuery) {
    const { filters } = query;
    // If classCategoryIds not specified and 
    // if the user is tutor & doesn't attempt to query his/her own classes
    if (!filters.classCategoryIds && (filters?.isTutor || filters?.isStudent) && !filters?.me) {
      const userPreferencesData = await this.userPreferencesProxy.fetchUserPreferences(filters.userId);
      filters.userPreferences = userPreferencesData?.preferences;
    }
    return this.classRepository.getClassesAndTotalCount(filters);
  }
}
