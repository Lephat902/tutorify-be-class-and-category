import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClassesAndTotalCountQuery } from '../impl';
import { ClassRepository } from 'src/class/infrastructure/repositories';
import { AddressProxy, GeocodeResponseDto, UserPreferencesProxy } from '@tutorify/shared';
import { ClassQueryDto } from '../../dtos';

@QueryHandler(GetClassesAndTotalCountQuery)
export class GetClassesAndTotalCountHandler implements IQueryHandler<GetClassesAndTotalCountQuery> {
  constructor(
    private readonly classRepository: ClassRepository,
    private readonly userPreferencesProxy: UserPreferencesProxy,
    private readonly addressProxy: AddressProxy,
  ) { }

  async execute(query: GetClassesAndTotalCountQuery) {
    const { filters } = query;
    await Promise.allSettled([
      this.setUserPreferences(filters),
      this.setLocation(filters),
    ]);
    return this.classRepository.getClassesAndTotalCount(filters);
  }

  async setUserPreferences(filters: ClassQueryDto) {
    // Get user preferences in case:
    // 1. He is an authenticated user which has his own preferences profile
    // 2. He doesn't try to get classes of a specific user (maybe himself)
    if (filters.userMakeRequest?.userId && !filters.userIdToGetClasses) {
      const userPreferencesData = await this.userPreferencesProxy.getUserPreferencesByUserId(filters.userMakeRequest.userId, 1000);
      filters.userPreferences = userPreferencesData?.preferences;
    }
  }

  async setLocation(filters: ClassQueryDto) {
    let res: GeocodeResponseDto;
    if (filters?.wardId) {
      res = await this.addressProxy.getGeocodeFromWardId(filters.wardId);
    } else if (filters?.districtId) {
      res = await this.addressProxy.getGeocodeFromDistrictId(filters.districtId);
    } else if (filters?.provinceId) {
      res = await this.addressProxy.getGeocodeFromProvinceId(filters.provinceId);
    }

    if (res) {
      filters.location = {
        type: 'Point',
        coordinates: [res.lon, res.lat],
      };
    }
  }
}
