import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3001, '0.0.0.0');
}
bootstrap();
