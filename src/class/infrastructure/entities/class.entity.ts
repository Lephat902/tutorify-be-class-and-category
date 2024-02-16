import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Geometry } from 'geojson';
import { ClassCategory } from 'src/category/entities';
import { GenderPref, TutorPositionPref } from '../enums';
import { Exclude } from 'class-transformer';

@Entity()
export class Class {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    studentId: string;

    @Column({ nullable: true })
    tutorId: string;

    @ManyToMany(() => ClassCategory)
    @JoinTable({ name: 'class_is_of_category' })
    classCategories: ClassCategory[];

    @Column({ default: '' })
    description: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @Column({ default: false })
    @Exclude()
    isHidden: boolean;

    @Column({ default: '' })
    requirement: string;

    @Column({ nullable: true })
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    wages: number;

    @Column({ default: '' })
    address: string;

    @Column({ default: '' })
    wardId: string;

    @Column({ type: 'geometry', spatialFeatureType: 'Point', nullable: true })
    @Exclude()
    location: Geometry;

    @Column({ default: false })
    isOnline: boolean;

    @Column()
    studentQty: number;

    @Column({ type: 'enum', enum: TutorPositionPref, nullable: true })
    tutorPositionPref: TutorPositionPref;

    @Column({ type: 'enum', enum: GenderPref, default: GenderPref.NOT_REQUIRED })
    tutorGenderPref: GenderPref;
}