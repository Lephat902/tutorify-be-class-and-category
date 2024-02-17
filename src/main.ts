import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './global-exception-filter';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use the global exception filter
  app.useGlobalFilters(new GlobalExceptionsFilter());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  for (const queue of ['class-category', 'class']) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue,
        queueOptions: {
          durable: false
        },
      },
    }, { inheritAppConfig: true }); // This line is important for globalFilter to work
  }

  app.startAllMicroservices();

  await app.listen(process.env.PORT);
}
bootstrap();