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

  @MessagePattern({ cmd: 'removeClass' })
  async removeClass(id: string): Promise<void> {
    return this.classService.removeClass(id);
  }

  @MessagePattern({ cmd: 'updateClass' })
  async updateClass(data: { id: string; classData: ClassCreateUpdateDto }): Promise<Class> {
    const { id, classData } = data;
    return this.classService.updateClass(id, classData);
  }

  @MessagePattern({ cmd: 'getClassByStudentId' })
  async getClassByStudentId(data: { studentId: string, filters: ClassQueryDto}): Promise<Class[]> {
    const { studentId, filters } = data;
    console.log(studentId);
    return this.classService.getClassByStudentId(studentId, filters);
  }

  @MessagePattern({ cmd: 'getClassByTutorId' })
  async getClassByTutorId(data: { tutorId: string, filters: ClassQueryDto}): Promise<Class[]> {
    const { tutorId, filters } = data;
    return this.classService.getClassByTutorId(tutorId, filters);
  }
}
