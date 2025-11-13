import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SucursalesController } from './sucursales.controller';
import { SucursalesService } from './sucursales.service';
import { Empresa, EmpresaSchema } from 'src/empresas/schemas/empresa.schema';
import { CuisHistorial, CuisHistorialSchema } from 'src/cuis-historial/schemas/cuis-historial.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Empresa.name, schema: EmpresaSchema },
            { name: CuisHistorial.name, schema: CuisHistorialSchema },
        ]),
    ],
    controllers: [SucursalesController],
    providers: [SucursalesService],
    exports: [SucursalesService],
})
export class SucursalesModule { }
