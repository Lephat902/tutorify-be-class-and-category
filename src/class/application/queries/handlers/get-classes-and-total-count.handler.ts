import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassesAndTotalCountQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { Inject } from '@nestjs/common';
import { QueueNames, UserPreferencesData } from '@tutorify/shared';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

type UserPreferences = {
  userId: string,
  preferences: UserPreferencesData,
}

@QueryHandler(GetClassesAndTotalCountQuery)
export class GetClassesAndTotalCountHandler implements IQueryHandler<GetClassesAndTotalCountQuery> {
  constructor(
    private readonly classRepository: ClassRepository,
    @Inject(QueueNames.USER_PREFERENCES) private readonly client: ClientProxy,
  ) { }

  async execute(query: GetClassesAndTotalCountQuery) {
    const { filters } = query;
    // If classCategoryIds not specified and 
    // if the user is tutor & doesn't attempt to query his/her own classes
    if (!filters.classCategoryIds && filters?.isTutor && !filters?.me) {
      const userPreferencesData = await this.fetchTutorProficiencies(filters.userId);
      filters.tutorPreferences = {
        classCategoryIds: userPreferencesData?.preferences?.classCategoryIds
      };
    }
    return this.classRepository.getClassesAndTotalCount(filters);
  }

  private async fetchTutorProficiencies(tutorId: string): Promise<UserPreferences> {
    // Limit as most 1s to fetch proficiencies
    try {
      return await firstValueFrom(
        this.client.send<UserPreferences>({ cmd: 'getUserPreferencesByUserId' }, tutorId)
          .pipe(timeout(1000))
      );
    } catch (error) {
      // Optionally, log the error or handle it as needed.
      console.error("Error fetching tutor proficiencies:", error);
      return await Promise.resolve(null);
    }
  }
}
