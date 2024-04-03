import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClassCategory, Level, Subject } from './entities';
import { ClassCategoryService } from './category.service';
import { ClassCategoryQueryDto } from './dtos';

@Controller()
export class ClassCategoryController {
  constructor(private readonly classCategoryService: ClassCategoryService) {}

  @MessagePattern({ cmd: 'get_all_categories' })
  getAll(filters: ClassCategoryQueryDto) {
    return this.classCategoryService.findAll(filters);
  }

  @MessagePattern({ cmd: 'get_whole_category_hierarchy_by_ids' })
  findWholeCategoryHierarchyByIds(ids: string[]): Promise<ClassCategory[]> {
    return this.classCategoryService.findWholeCategoryHierarchyByIds(ids);
  }

  @MessagePattern({ cmd: 'get_category_by_id' })
  getCategoryById(id: string): Promise<ClassCategory> {
    return this.classCategoryService.getCategoryById(id);
  }

  @MessagePattern({ cmd: 'get_all_subjects' })
  getAllSubjects(): Promise<Subject[]> {
    return this.classCategoryService.findAllSubjects();
  }

  @MessagePattern({ cmd: 'get_all_levels' })
  getAllLevels(): Promise<Level[]> {
    return this.classCategoryService.findAllLevels();
  }

  @MessagePattern({ cmd: 'get_subjects_by_level' })
  getSubjectsByLevel(levelId: string): Promise<Subject[]> {
    return this.classCategoryService.findSubjectsByLevel(levelId);
  }

  @MessagePattern({ cmd: 'get_levels_by_subject' })
  getLevelsBySubject(subjectId: string): Promise<Level[]> {
    return this.classCategoryService.findLevelsBySubject(subjectId);
  }

  @MessagePattern({ cmd: 'insert_category' })
  insert(dto: { level: Level; subject: Subject }): Promise<ClassCategory> {
    return this.classCategoryService.insert(dto.level, dto.subject);
  }
}
