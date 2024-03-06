import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Class } from './class.entity';
import { Weekday } from '@tutorify/shared';
import { Exclude } from 'class-transformer';

@Entity()
export class ClassTimeSlot {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ type: 'time', nullable: false })
  startTime: Date;

  @Column({ type: 'time', nullable: false })
  endTime: Date;

  @Column({ type: 'enum', enum: Weekday, nullable: false })
  weekday: Weekday;

  @ManyToOne(() => Class, (classEntity) => classEntity.timeSlots, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  class: Class;
}
