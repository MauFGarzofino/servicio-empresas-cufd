import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './health.controller';
// import { EmpresasModule } from './empresas/empresas.module';
// import { SucursalesModule } from './sucursales/sucursales.module';
// import { PuntosVentaModule } from './puntos-venta/puntos-venta.module';
// import { CufdModule } from './cufd/cufd.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        // EmpresasModule,
        // SucursalesModule,
        // PuntosVentaModule,
        // CufdModule,
    ],
    controllers: [HealthController],
})
export class AppModule { }
