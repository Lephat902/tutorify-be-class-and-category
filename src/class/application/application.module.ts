import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BroadcastModule } from '@tutorify/shared';

@Module({
  imports: [
    InfrastructureModule,
    CqrsModule,
    BroadcastModule,
  ],
  controllers: [ClassController],
  providers: [...CommandHandlers, ...QueryHandlers, ClassService],
})
export class ApplicationModule { }
