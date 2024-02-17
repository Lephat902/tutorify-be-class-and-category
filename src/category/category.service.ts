import { ConflictException, Injectable } from '@nestjs/common';
import { ClassCategory, Level, Subject } from './entities';
import { ClassCategoryRepository, LevelRepository, SubjectRepository } from './repositories';

@Injectable()
export class ClassCategoryService {
    constructor(
        private readonly classCategoryRepository: ClassCategoryRepository,
        private readonly levelRepository: LevelRepository,
        private readonly subjectRepository: SubjectRepository,
    ) { }

    findAll(): Promise<ClassCategory[]> {
        return this.classCategoryRepository.find();
    }

    findAllSubjects(): Promise<Subject[]> {
        return this.subjectRepository.find();
    }

    findAllLevels(): Promise<Level[]> {
        return this.levelRepository.find();
    }

    async findSubjectsByLevel(levelId: string): Promise<Subject[]> {
        const categories = await this.classCategoryRepository
            .createQueryBuilder('classCategory')
            .leftJoinAndSelect('classCategory.subject', 'subject')
            .where('classCategory.levelId = :levelId', { levelId })
            .getMany();
        return categories.map(category => category.subject);
    }

    async findLevelsBySubject(subjectId: string): Promise<Level[]> {
        const categories = await this.classCategoryRepository
            .createQueryBuilder('classCategory')
            .leftJoinAndSelect('classCategory.level', 'level')
            .where('classCategory.subjectId = :subjectId', { subjectId })
            .getMany();
        return categories.map(category => category.level);
    }

    async insert(levelDto: Level, subjectDto: Subject): Promise<ClassCategory> {
        let level = await this.levelRepository.findOne({ where: { name: levelDto.name } });
        if (!level) {
            level = this.levelRepository.create(levelDto);
            level = await this.levelRepository.save(level);
        }

        let subject = await this.subjectRepository.findOne({ where: { name: subjectDto.name } });
        if (!subject) {
            subject = this.subjectRepository.create(subjectDto);
            subject = await this.subjectRepository.save(subject);
        }

        const existingCategory = await this.classCategoryRepository.findOne({ where: { level, subject } });

        if (existingCategory) {
            throw new ConflictException('Class category with this level and subject already exists');
        }

        const classCategory = this.classCategoryRepository.create({
            level,
            subject,
        });

        return this.classCategoryRepository.save(classCategory);
    }
}
