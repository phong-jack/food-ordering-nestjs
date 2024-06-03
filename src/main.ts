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
import { RedisIoAdapter } from './common/gateway/redis.adapter';
import { SentryFilter } from './common/filters/sentry-exeption.filter';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import * as firebase from 'firebase-admin';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.ENV || 'development',
    serverName: 'localhost',
    tracesSampleRate: 1.0,
    // enabled:
  });

  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PJ_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });

  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('/api');
  await swaggerInit(app);
  const { httpAdapter } = app.get(HttpAdapterHost);
  //filter
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(
    new SentryFilter(httpAdapter),
    new TypeORMExceptionFilter(),
    new ErrorExceptionsFilter(),
    new HttpExceptionFilter(),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new SentryInterceptor());

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(3000);

  console.log(`App url: ${await app.getUrl()}`);
  console.log(`Document url: ${await app.getUrl()}/document`);
}

bootstrap();
