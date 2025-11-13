import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateSucursalDto {
    @ApiPropertyOptional({ example: 'Sucursal Central Actualizada' })
    @IsString()
    @Length(2, 120)
    @IsOptional()
    nombre?: string;

    @ApiPropertyOptional({ example: 'Av. Aroma 456' })
    @IsString()
    @IsOptional()
    direccion?: string;
}
