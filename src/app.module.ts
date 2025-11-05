import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { EmpresasModule } from './empresas/empresas.module';
// import { SucursalesModule } from './sucursales/sucursales.module';
// import { PuntosVentaModule } from './puntos-venta/puntos-venta.module';
// import { CufdModule } from './cufd/cufd.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI as string, {
            replicaSet: process.env.MONGO_RS, // para transacciones
        }),
        // EmpresasModule,
        // SucursalesModule,
        // PuntosVentaModule,
        // CufdModule,
    ],
})
export class AppModule { }
