import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ClassCreateDto, ClassUpdateDto } from './dtos';
import { Class } from '../infrastructure/entities';
import { CancelClassByIdCommand, CreateClassCommand, UpdateClassCommand } from './commands/impl';
import { DeleteClassByIdCommand } from './commands/impl/delete-class-by-id.command';
import { ClassQueryDto } from './dtos/class-query.dto';
import {
  GetClassByIdQuery,
  GetClassesAndTotalCountQuery,
  GetNumberOfClassesByCategoryIdQuery,
} from './queries/impl';

@Injectable()
export class ClassService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  async addClass(
    studentId: string,
    classData: ClassCreateDto,
  ): Promise<Class> {
    return this.commandBus.execute(
      new CreateClassCommand(studentId, classData),
    );
  }

  async deleteClassById(id: string, userMakeRequest: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteClassByIdCommand(id, userMakeRequest));
  }

  async updateClass(
    id: string,
    classData: ClassUpdateDto,
  ): Promise<Class> {
    return this.commandBus.execute(new UpdateClassCommand(id, classData));
  }

  async cancelClass(id: string): Promise<boolean> {
    return this.commandBus.execute(new CancelClassByIdCommand(id));
  }

  async getClassById(id: string): Promise<Class> {
    return this.queryBus.execute(new GetClassByIdQuery(id));
  }

  async getClassesAndTotalCount(filters: ClassQueryDto): Promise<{
    classes: Class[],
    totalCount: number,
  }> {
    return this.queryBus.execute(new GetClassesAndTotalCountQuery(filters));
  }

  async getNumberOfClassesByCategoryId(
    classCategoryId: string,
  ): Promise<number> {
    return this.queryBus.execute(new GetNumberOfClassesByCategoryIdQuery(classCategoryId));
  }
}
