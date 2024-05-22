import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Class } from '../../infrastructure/entities';
import { ClassService } from '../class.service';
import { ClassCreateDto, ClassQueryDto, ClassStatisticByYearDto, ClassUpdateDto } from '../dtos';

@Controller()
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @MessagePattern({ cmd: 'addClass' })
  async addClass(classData: ClassCreateDto): Promise<Class> {
    return this.classService.addClass(classData);
  }

  @MessagePattern({ cmd: 'deleteClassById' })
  async deleteClassById(data: {
    id: string,
    userMakeRequest: string,
  }): Promise<boolean> {
    const { id, userMakeRequest } = data;
    return this.classService.deleteClassById(id, userMakeRequest);
  }

  @MessagePattern({ cmd: 'updateClass' })
  async updateClass(data: {
    id: string;
    classData: ClassUpdateDto;
  }): Promise<Class> {
    const { id, classData } = data;
    return this.classService.updateClass(id, classData);
  }

  @MessagePattern({ cmd: 'cancelClass' })
  async cancelClass(id: string): Promise<boolean> {
    return this.classService.cancelClass(id);
  }

  @MessagePattern({ cmd: 'getClassById' })
  async getClassById(id: string): Promise<Class> {
    return this.classService.getClassById(id);
  }

  @MessagePattern({ cmd: 'getClassesAndTotalCount' })
  async getClassesAndTotalCount(filters: ClassQueryDto): Promise<{
    classes: Class[],
    totalCount: number,
  }> {
    return this.classService.getClassesAndTotalCount(filters);
  }

  @MessagePattern({ cmd: 'getNumberOfClassesByCategoryId' })
  async getNumberOfClassesByCategoryId(classCategoryId: string): Promise<number> {
    return this.classService.getNumberOfClassesByCategoryId(classCategoryId);
  }

  @MessagePattern({ cmd: 'cleanupTestClasses' })
  async cleanupTestClasses(): Promise<number> {
    return this.classService.cleanupTestClasses();
  }

  @MessagePattern({ cmd: 'getClassStatisticByYear' })
  async getClassStatisticByYear(classStatisticDto: ClassStatisticByYearDto) {
    return this.classService.getClassStatisticByYear(classStatisticDto);
  }
}
