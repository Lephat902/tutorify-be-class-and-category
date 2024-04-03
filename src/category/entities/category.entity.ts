import { Entity, PrimaryGeneratedColumn, Unique, ManyToOne, ManyToMany } from 'typeorm';
import { Level } from './level.entity';
import { Subject } from './subject.entity';
import { Class } from 'src/class/infrastructure/entities';

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

  @ManyToMany(() => Class, (cl) => cl.classCategories)
  classes: Class[];
}
