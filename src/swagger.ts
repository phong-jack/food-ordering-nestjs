import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default async function (app: NestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Food ordering')
    .setDescription('Food ordering')
    .setVersion('0.1')
    .addTag('user')
    .addTag('auth')
    .addTag('product')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, document);
}
