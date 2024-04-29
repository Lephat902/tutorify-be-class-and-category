import { Global, Module } from '@nestjs/common';
import { ClassCategory, Level, Subject } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ClassCategoryController } from './category.controller';
import { ClassCategoryService } from './category.service';
import {
  ClassCategoryRepository,
  LevelRepository,
  SubjectRepository,
} from './repositories';
import { BroadcastModule } from '@tutorify/shared';
import { Class, ClassTimeSlot } from 'src/class/infrastructure/entities';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

const entities = [Level, Subject, ClassCategory, Class, ClassTimeSlot];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('DATABASE_TYPE'),
        url: configService.get('DATABASE_URI'),
        entities,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    BroadcastModule,
  ],
  controllers: [ClassCategoryController],
  providers: [
    ClassCategoryService,
    ClassCategoryRepository,
    SubjectRepository,
    LevelRepository,
  ],
  exports: [ClassCategoryRepository],
})
export class CategoryModule {}
