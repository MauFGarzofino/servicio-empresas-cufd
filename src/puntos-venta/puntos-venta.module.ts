import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuntosVentaController } from './puntos-venta.controller';
import { PuntosVentaService } from './puntos-venta.service';
import { PuntoVenta, PuntoVentaSchema } from './schemas/punto-venta.schema';
import { PuntosVentaGrpcController } from './punto-venta.grpc.controller';
import { AuthGrpcClient } from 'src/grpc/auth.grpc';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PuntoVenta.name, schema: PuntoVentaSchema }]),
    ],
    controllers: [PuntosVentaController, PuntosVentaGrpcController],
    providers: [PuntosVentaService, AuthGrpcClient],
    exports: [PuntosVentaService],
})
export class PuntosVentaModule { }
