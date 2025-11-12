import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPuntoVentaDto {
    @ApiPropertyOptional() nit?: string;
    @ApiPropertyOptional() codigoSucursal?: string;
    @ApiPropertyOptional() estado?: string;
    @ApiPropertyOptional({ description: 'Número de página', default: 1 }) page?: number;
    @ApiPropertyOptional({ description: 'Tamaño de página', default: 10 }) limit?: number;
}