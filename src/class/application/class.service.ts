import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClassCreateUpdateDto } from './dtos';
import { Class } from '../infrastructure/entities';
import { CreateClassCommand, UpdateClassCommand } from './commands/impl';
import { DeleteClassByIdCommand } from './commands/impl/delete-class-by-id.command';
import { ClassQueryDto } from './dtos/class-query.dto';
import {
  GetClassByIdQuery,
  GetClassesAndTotalCountQuery,
  GetClassesByStudentIdQuery,
  GetClassesByTutorIdQuery,
  GetClassesQuery,
} from './queries/impl';
import { GetClassesByUserIdQuery } from './queries/impl/get-classes-by-user-id.query';

@Injectable()
export class ClassService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async addClass(
    studentId: string,
    classData: ClassCreateUpdateDto,
  ): Promise<Class> {
    return this.commandBus.execute(
      new CreateClassCommand(studentId, classData),
    );
  }

  async deleteClassById(id: string): Promise<void> {
    return this.commandBus.execute(new DeleteClassByIdCommand(id));
  }

  async updateClass(
    id: string,
    classData: Partial<ClassCreateUpdateDto>,
  ): Promise<Class> {
    return this.commandBus.execute(new UpdateClassCommand(id, classData));
  }

  async getClassById(id: string): Promise<Class> {
    return this.queryBus.execute(new GetClassByIdQuery(id));
  }

  async getClasses(filters: ClassQueryDto): Promise<Class[]> {
    return this.queryBus.execute(new GetClassesQuery(filters));
  }

  async getClassesAndTotalCount(filters: ClassQueryDto): Promise<{
    classes: Class[],
    totalCount: number,
  }> {
    return this.queryBus.execute(new GetClassesAndTotalCountQuery(filters));
  }

  async getClassesByStudentId(
    studentId: string,
    filters: ClassQueryDto,
  ): Promise<Class[]> {
    return this.queryBus.execute(
      new GetClassesByStudentIdQuery(studentId, filters),
    );
  }

  async getClassesByTutorId(
    tutorId: string,
    filters: ClassQueryDto,
  ): Promise<Class[]> {
    return this.queryBus.execute(
      new GetClassesByTutorIdQuery(tutorId, filters),
    );
  }

  async getClassesByUserId(
    userId: string,
    filters: ClassQueryDto,
  ): Promise<Class[]> {
    return this.queryBus.execute(new GetClassesByUserIdQuery(userId, filters));
  }
}
