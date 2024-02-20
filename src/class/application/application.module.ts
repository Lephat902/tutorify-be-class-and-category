import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { SagaHandlers } from './sagas/handlers';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SagaModule } from 'nestjs-saga';

@Module({
  imports: [
    InfrastructureModule,
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'TUTOR_APPLY_FOR_CLASS_SERVICE',
        inject: [ConfigService], // Inject ConfigService
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'tutor-apply-for-class',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    SagaModule.register({
      imports: [ApplicationModule],
      sagas: SagaHandlers,
    }),
  ],
  controllers: [ClassController],
  providers: [...CommandHandlers, ...QueryHandlers, ClassService],
  exports: [ClientsModule],
})
export class ApplicationModule { }
