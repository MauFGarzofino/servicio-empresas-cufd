import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateSucursalDto {
    @ApiProperty({ example: '001' })
    @IsString()
    @Matches(/^[A-Za-z0-9-_]{1,10}$/, { message: 'codigoSucursal inválido (1-10, alfanumérico, -, _)' })
    codigoSucursal: string;

    @ApiProperty({ example: 'Sucursal Central' })
    @IsString()
    @Length(2, 120)
    nombre: string;

    @ApiPropertyOptional({ example: 'Av. Heroínas 123' })
    @IsString()
    @IsOptional()
    direccion?: string;
}
