import { ClassCategory } from './category.entity';
import { Level } from './level.entity';
import { Subject } from './subject.entity';

export * from './category.entity';
export * from './level.entity';
export * from './subject.entity';

export const entities = [Subject, Level, ClassCategory];
