import { ApiProperty } from '@nestjs/swagger';

export class CreatePuntoVentaDto {
    @ApiProperty() nit: string;
    @ApiProperty() codigoSucursal: string;
    @ApiProperty() codigoPuntoVenta: string;
    @ApiProperty() nombre: string;

    @ApiProperty({ required: false }) tipoId?: number;
    @ApiProperty({ required: false }) tipo?: string;
    @ApiProperty({ required: false, default: 'ACTIVO' }) estado?: string;
}
