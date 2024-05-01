import { HttpAdapterHost, NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerInit from './swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './common/filters/type-orm-exception.filter';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  await swaggerInit(app);
  //filter
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TypeORMExceptionFilter(), new HttpExceptionFilter());

  await app.listen(3000);

  console.log(`App url: ${await app.getUrl()}`);
  console.log(`Document url: ${await app.getUrl()}/document`);
}

bootstrap();
