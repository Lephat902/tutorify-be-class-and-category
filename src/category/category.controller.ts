import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClassCategory, Level, Subject } from './entities';
import { ClassCategoryService } from './category.service';

@Controller()
export class ClassCategoryController {
    constructor(private readonly classCategoryService: ClassCategoryService) { }

    @MessagePattern({ cmd: 'get_all_categories' })
    getAll(): Promise<ClassCategory[]> {
        return this.classCategoryService.findAll();
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