import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Sucursal } from 'src/common/schemas/sucursal.schema';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' } })
export class Empresa extends Document {
    @Prop({ required: true, unique: true })
    nit: string;

    @Prop({ required: true })
    razonSocial: string;

    @Prop({ enum: ['ACTIVA', 'INACTIVA', 'BLOQUEADA'], default: 'ACTIVA' })
    estado: string;

    @Prop({ type: [Sucursal], default: [] })
    @Type(() => Sucursal)
    sucursales: Sucursal[];
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);

EmpresaSchema.index({ 'sucursales.codigoSucursal': 1 });
