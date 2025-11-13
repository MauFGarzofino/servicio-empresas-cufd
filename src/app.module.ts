import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpresasModule } from './empresas/empresas.module';
import { PuntosVentaModule } from './puntos-venta/puntos-venta.module';
import { SucursalesModule } from './sucursales/sucursales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    EmpresasModule,
    SucursalesModule,
    PuntosVentaModule,
  ],
})
export class AppModule { }