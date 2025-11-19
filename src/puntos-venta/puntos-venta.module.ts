import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuntosVentaController } from './puntos-venta.controller';
import { PuntosVentaService } from './puntos-venta.service';
import { PuntoVenta, PuntoVentaSchema } from './schemas/punto-venta.schema';
import { PuntosVentaGrpcController } from './punto-venta.grpc.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PuntoVenta.name, schema: PuntoVentaSchema }]),
    ],
    controllers: [PuntosVentaController, PuntosVentaGrpcController],
    providers: [PuntosVentaService],
    exports: [PuntosVentaService],
})
export class PuntosVentaModule { }
