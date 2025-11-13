import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // quita campos no declarados en DTO
    forbidNonWhitelisted: true, // lanza error si llegan campos extra
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const config = new DocumentBuilder()
    .setTitle('Servicio Empresas-CUFD')
    .setDescription('API para gestión de empresas y CUIS embebido en sucursales')
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('empresas/api/docs', app, doc);

  await app.listen(process.env.PORT || 3000);
  console.log(`Swagger: http://localhost:3001/api/docs`);
}
bootstrap();
