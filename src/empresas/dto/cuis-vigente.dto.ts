import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CuisVigenteDto {
    @ApiPropertyOptional({ example: '110B8ADF' })
    @IsString() @IsOptional()
    codigo?: string;

    @ApiPropertyOptional({ example: '2025-12-31T23:59:59-04:00' })
    @IsString() @IsOptional()
    fechaVigencia?: string;

    @ApiPropertyOptional({ example: 1767220799, description: 'UNIX timestamp' })
    @IsInt() @Min(0) @IsOptional()
    timeVigencia?: number;

    @ApiPropertyOptional({
        example: { codigo: 980, descripcion: 'SUCURSAL O PUNTO DE VENTA' },
        description: 'Estructura libre, puede ser null',
    })
    @IsOptional()
    mensajesList?: Record<string, any> | null;

    @ApiPropertyOptional({ example: true })
    @IsBoolean() @IsOptional()
    transaccion?: boolean;
}