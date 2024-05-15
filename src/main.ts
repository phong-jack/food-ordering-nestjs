import {
  HttpAdapterHost,
  NestApplication,
  NestFactory,
  Reflector,
} from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerInit from './swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './common/filters/type-orm-exception.filter';
import { ErrorExceptionsFilter } from './common/filters/error-exeption.filter';
import { WebsocketExceptionsFilter } from './common/filters/websocket-exception.filter';
import { RedisIoAdapter } from './common/gateway/redis.adapter';
import { ValidateExceptionFilter } from './common/filters/validate-exception.filter';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  await swaggerInit(app);

  //filter
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new ValidateExceptionFilter(),
    new TypeORMExceptionFilter(),
    new ErrorExceptionsFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(3000);

  console.log(`App url: ${await app.getUrl()}`);
  console.log(`Document url: ${await app.getUrl()}/document`);
}

bootstrap();
