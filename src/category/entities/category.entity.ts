import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne } from 'typeorm';
import { Level } from './level.entity';
import { Subject } from './subject.entity';

@Entity()
@Unique(['subject', 'level'])
export class ClassCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subject, (subject) => subject.classCategories, {
    nullable: false,
    eager: true,
  })
  subject: Subject;

  @ManyToOne(() => Level, (level) => level.classCategories, {
    nullable: false,
    eager: true,
  })
  level: Level;
}
