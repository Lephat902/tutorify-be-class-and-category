import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { ClassService } from './class.service';
import { ClassController, ClassEventHandlerController } from './controllers';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BroadcastModule } from '@tutorify/shared';
import { ClassEventDispatcher } from './class.event-dispatcher';

@Module({
  imports: [InfrastructureModule, CqrsModule, BroadcastModule],
  controllers: [ClassController, ClassEventHandlerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ClassService,
    ClassEventDispatcher,
  ],
})
export class ApplicationModule {}
