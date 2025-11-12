import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CuisHistorial extends Document {
    @Prop({ required: true })
    nit: string;

    @Prop({ required: true })
    codigoSucursal: string;

    @Prop({ required: true })
    codigo: string;

    @Prop({ required: true })
    fechaVigencia: string;

    @Prop({ required: true })
    timeVigencia: number;

    @Prop({ type: Object, default: null })
    mensajesList?: Record<string, any> | null;

    @Prop({ default: true })
    transaccion: boolean;

    @Prop({ enum: ['ACTIVO', 'EXPIRADO', 'REVOCADO'], default: 'ACTIVO' })
    estado: string;

    @Prop({ default: () => new Date() })
    emitidoEn: Date;
}

export const CuisHistorialSchema = SchemaFactory.createForClass(CuisHistorial);
