import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CuisVigenteDto } from './cuis-vigente.dto';

export class SucursalDto {
    @ApiProperty({ example: '001' })
    @IsString()
    codigoSucursal: string;

    @ApiProperty({ example: 'Sucursal Central' })
    @IsString()
    nombre: string;

    @ApiPropertyOptional({ example: 'Av. Heroínas 123' })
    @IsString() @IsOptional()
    direccion?: string;

    @ApiPropertyOptional({ type: CuisVigenteDto })
    @IsOptional()
    cuisVigente?: CuisVigenteDto;
}