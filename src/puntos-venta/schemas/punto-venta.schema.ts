import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CufdVigente } from 'src/common/schemas/cufd-vigente.schema';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } })
export class PuntoVenta extends Document {
    @Prop({ required: true })
    nit: string; // NIT de la empresa

    @Prop({ required: true })
    codigoSucursal: string; // Sucursal asociada

    @Prop({ required: true })
    codigoPuntoVenta: string; // Código de punto de venta

    @Prop({ required: true })
    nombre: string;

    @Prop()
    tipoId?: number;

    @Prop()
    tipo?: string;

    @Prop({ default: 'ACTIVO' })
    estado: string;

    @Prop({ type: CufdVigente })
    cufdVigente?: CufdVigente; // CUFD vigente embebido

    @Prop({ default: () => new Date() })
    creadoEn: Date;

    @Prop({ default: () => new Date() })
    actualizadoEn: Date;
}

export const PuntoVentaSchema = SchemaFactory.createForClass(PuntoVenta);
PuntoVentaSchema.index(
    { nit: 1, codigoSucursal: 1, codigoPuntoVenta: 1 },
    { unique: true }
);