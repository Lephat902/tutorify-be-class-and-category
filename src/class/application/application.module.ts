import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { ClassService } from './class.service';
import { ClassController, ClassEventHandlerController } from './controllers';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BroadcastModule, QueueNames, UserPreferencesProxy, AddressProxy } from '@tutorify/shared';
import { ClassEventDispatcher } from './class.event-dispatcher';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    InfrastructureModule,
    CqrsModule,
    BroadcastModule,
    ClientsModule.registerAsync([
      {
        name: QueueNames.USER_PREFERENCES,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: QueueNames.USER_PREFERENCES,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: QueueNames.ADDRESS,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: QueueNames.ADDRESS,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ])
  ],
  controllers: [ClassController, ClassEventHandlerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ClassService,
    ClassEventDispatcher,
    UserPreferencesProxy,
    AddressProxy,
  ],
})
export class ApplicationModule { }
