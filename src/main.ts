import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    // Consola visible para comprobación
    console.log(`Servicio de Empresas y CUFD iniciado en puerto ${port}`);
}
bootstrap();
