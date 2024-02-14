import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ClassCategory } from './category.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Level {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Exclude()
  @OneToMany(() => ClassCategory, classCategory => classCategory.level)
  classCategories: ClassCategory[];
}