import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClassService } from './class.service';
import { Class } from '../infrastructure/entities';
import { ClassCreateUpdateDto } from './dtos';
import { ClassQueryDto } from './dtos/class-query.dto';

@Controller()
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @MessagePattern({ cmd: 'addClass' })
  async addClass(dto: { studentId: string, classData: ClassCreateUpdateDto }): Promise<Class> {
    const { studentId, classData } = dto;
    return this.classService.addClass(studentId, classData);
  }

  @MessagePattern({ cmd: 'deleteClassById' })
  async deleteClassById(id: string): Promise<void> {
    return this.classService.deleteClassById(id);
  }

  @MessagePattern({ cmd: 'updateClass' })
  async updateClass(data: { id: string; classData: Partial<ClassCreateUpdateDto> }): Promise<Class> {
    const { id, classData } = data;
    return this.classService.updateClass(id, classData);
  }

  @MessagePattern({ cmd: 'getClassById' })
  async getClassById(id: string): Promise<Class> {
    return this.classService.getClassById(id);
  }

  @MessagePattern({ cmd: 'getClasses' })
  async getClasses(data: { filters: ClassQueryDto }): Promise<Class[]> {
    const { filters } = data;
    return this.classService.getClasses(filters);
  }

  @MessagePattern({ cmd: 'getClassesByStudentId' })
  async getClassesByStudentId(data: { studentId: string, filters: ClassQueryDto }): Promise<Class[]> {
    const { studentId, filters } = data;
    return this.classService.getClassesByStudentId(studentId, filters);
  }

  @MessagePattern({ cmd: 'getClassesByTutorId' })
  async getClassesByTutorId(data: { tutorId: string, filters: ClassQueryDto }): Promise<Class[]> {
    const { tutorId, filters } = data;
    return this.classService.getClassesByTutorId(tutorId, filters);
  }
}
