import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePuntoVentaDto {
    @ApiProperty({
        description: 'Nombre descriptivo del punto de venta',
        example: 'Punto de venta central',
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        required: false,
        description: 'Identificador del tipo de punto de venta (según catálogo interno)',
        example: 2,
    })
    @IsOptional()
    @IsNumber()
    tipoId?: number;

    @ApiProperty({
        required: false,
        description: 'Descripción del tipo de punto de venta',
        example: 'PUNTO VENTA VENTANILLA DE COBRANZA',
    })
    @IsOptional()
    @IsString()
    tipo?: string;

    @ApiProperty({
        required: false,
        default: 'ACTIVO',
        description: 'Estado lógico del punto de venta (ACTIVO / INACTIVO / BLOQUEADO, etc.)',
        example: 'ACTIVO',
    })
    @IsOptional()
    @IsString()
    estado?: string;
}
