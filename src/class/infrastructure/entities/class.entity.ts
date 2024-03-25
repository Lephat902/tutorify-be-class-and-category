import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Geometry } from 'geojson';
import { ClassCategory } from 'src/category/entities';
import { ClassStatus, GenderPref, TutorPositionPref } from '@tutorify/shared';
import { Exclude } from 'class-transformer';
import { ClassTimeSlot } from './class-timeslot.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  studentId: string;

  @Column({ nullable: true })
  tutorId: string;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.UNASSIGNED })
  status: ClassStatus;

  @ManyToMany(() => ClassCategory, { eager: true })
  @JoinTable({ name: 'class_is_of_category' })
  classCategories: ClassCategory[];

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ default: false })
  @Exclude()
  isHidden: boolean;

  @Column({ nullable: true })
  requirement: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  wages: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  wardId: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', nullable: true })
  @Exclude()
  location: Geometry;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  studentQty: number;

  @Column({ type: 'enum', enum: TutorPositionPref, default: TutorPositionPref.NOT_REQUIRED })
  tutorPositionPref: TutorPositionPref;

  @Column({ type: 'enum', enum: GenderPref, default: GenderPref.NOT_REQUIRED })
  tutorGenderPref: GenderPref;

  @OneToMany(() => ClassTimeSlot, (timeSlot) => timeSlot.class, {
    cascade: true,
    eager: true,
  })
  timeSlots: ClassTimeSlot[];

  @Column({ nullable: true })
  imgUrl: string;
}
