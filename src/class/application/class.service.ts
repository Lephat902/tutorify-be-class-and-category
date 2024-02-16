import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClassCreateUpdateDto } from './dtos';
import { Class } from '../infrastructure/entities';
import { CreateClassCommand } from './commands/impl';
import { DeleteClassCommand } from './commands/impl/delete-class.command';
import { ClassQueryDto } from './dtos/class-query.dto';
import { GetClassByStudentIdQuery, GetClassByTutorIdQuery } from './queries/impl';

@Injectable()
export class ClassService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  async addClass(studentId: string, classData: ClassCreateUpdateDto): Promise<Class> {
    return this.commandBus.execute(new CreateClassCommand(studentId, classData));
  }

  async removeClass(id: string): Promise<void> {
    return this.commandBus.execute(new DeleteClassCommand(id));
  }

  async updateClass(id: string, classData: ClassCreateUpdateDto ): Promise<Class> {
    return this.commandBus.execute(new CreateClassCommand(id, classData));
  }

  async getClassByStudentId(studentId: string, filters: ClassQueryDto): Promise<Class[]> {
    return this.queryBus.execute(new GetClassByStudentIdQuery(studentId, filters));
  }

  async getClassByTutorId(tutorId: string, filters: ClassQueryDto): Promise<Class[]> {
    return this.queryBus.execute(new GetClassByTutorIdQuery(tutorId, filters));
  }
}
