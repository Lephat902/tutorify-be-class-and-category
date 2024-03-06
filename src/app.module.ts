import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ClassModule } from './class/class.module';

@Module({
  imports: [
    ClassModule,
    CategoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example'],
    }),
  ],
})
export class AppModule {}
