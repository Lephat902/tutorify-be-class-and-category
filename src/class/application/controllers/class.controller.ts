import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClassService } from '../class.service';
import { Class } from '../../infrastructure/entities';
import { ClassCreateDto, ClassUpdateDto, ClassQueryDto } from '../dtos';

@Controller()
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @MessagePattern({ cmd: 'addClass' })
  async addClass(dto: {
    studentId: string;
    classData: ClassCreateDto;
  }): Promise<Class> {
    const { studentId, classData } = dto;
    return this.classService.addClass(studentId, classData);
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
}
