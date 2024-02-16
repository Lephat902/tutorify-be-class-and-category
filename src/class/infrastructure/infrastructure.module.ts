import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities';
import { ClassRepository } from './repositories';
import { entities as categoryEntities } from 'src/category/entities';

const entities = [Class, ...categoryEntities];

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
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ClassRepository],
  exports: [ClassRepository],
})
export class InfrastructureModule { }
