import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { LogstashInterceptor } from './logger/logstash.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // quita campos no declarados en DTO
    forbidNonWhitelisted: true, // lanza error si llegan campos extra
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.useGlobalInterceptors(new LogstashInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Servicio Empresas-CUFD')
    .setDescription('API para gestión de empresas y CUIS embebido en sucursales')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido desde /auth/token',
      },
      'JWT-auth',
    )
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('empresas/api/docs', app, doc);

  const grpcApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50051', // puerto gRPC
      package: 'punto_venta',
      protoPath: join(__dirname, '../proto/punto_venta.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
  console.log(`Swagger: http://localhost:3001/api/docs`);
}
bootstrap();
