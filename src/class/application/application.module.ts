import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    InfrastructureModule,
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'MAIL_SERVICE',
        inject: [ConfigService], // Inject ConfigService
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'mail',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'VERIFICATION_SERVICE',
        inject: [ConfigService], // Inject ConfigService
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')],
            queue: 'verification-token',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [ClassController],
  providers: [...CommandHandlers, ...QueryHandlers, ClassService],
})
export class ApplicationModule { }
