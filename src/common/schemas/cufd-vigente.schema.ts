import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CufdVigente {
    @Prop({ required: true })
    codigo: string; // Código CUFD emitido por el sistema/SIN

    @Prop({ required: true })
    codigoControl: string; // Código de control diario (clave de autorización)

    @Prop({ required: true })
    fechaVigencia: string; // Fecha límite de uso (ISO string)

    @Prop({ required: true })
    timeVigencia: number; // Timestamp UNIX

    @Prop({ type: Object, default: null })
    mensajesList?: Record<string, any> | null; // Observaciones

    @Prop({ default: true })
    transaccion: boolean; // Indica si la solicitud fue exitosa
}
