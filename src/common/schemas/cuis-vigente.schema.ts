import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CuisVigente {
    @Prop({ required: true })
    codigo: string; // Código CUIS emitido por el sistema/SIN

    @Prop({ required: true })
    fechaVigencia: string; // Fecha de expiración (ISO string)

    @Prop({ required: true })
    timeVigencia: number; // Timestamp UNIX de expiración

    @Prop({ type: Object, default: null })
    mensajesList?: Record<string, any> | null; // Mensajes del SIN u observaciones

    @Prop({ default: true })
    transaccion: boolean; // Indica si la solicitud fue válida/exitosa
}
