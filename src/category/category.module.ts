import { Module } from '@nestjs/common';
import { ClassCategory, Level, Subject } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ClassCategoryController } from './category.controller';
import { ClassCategoryService } from './category.service';

const entities = [
  Level,
  Subject,
  ClassCategory,
]

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('DATABASE_TYPE'),
        url: configService.get('DATABASE_URI'),
        entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    ClassCategoryController,
  ],
  providers: [
    ClassCategoryService,
  ]
})
export class CategoryModule { }
