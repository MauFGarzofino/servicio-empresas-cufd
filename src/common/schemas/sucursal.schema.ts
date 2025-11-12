import { Prop, Schema } from '@nestjs/mongoose';
import { CuisVigente } from './cuis-vigente.schema';

@Schema({ _id: false })
export class Sucursal {
    @Prop({ required: true })
    codigoSucursal: string;

    @Prop({ required: true })
    nombre: string;

    @Prop()
    direccion?: string;

    @Prop({ type: CuisVigente })
    cuisVigente?: CuisVigente; // CUIS vigente embebido (permiso macro)

    @Prop({ default: () => new Date() })
    creadoEn: Date;

    @Prop({ default: () => new Date() })
    actualizadoEn: Date;
}
