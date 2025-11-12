import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateEmpresaDto {
    @ApiProperty({ example: '1020304050', description: 'NIT numérico sin guiones' })
    @IsString()
    @Matches(/^\d{7,13}$/, { message: 'El NIT debe ser numérico de 7 a 13 dígitos' })
    nit: string;

    @ApiProperty({ example: 'ACME SRL' })
    @IsString()
    @Length(2, 120)
    razonSocial: string;

    @ApiPropertyOptional({ example: 'contacto@acme.bo' })
    @IsEmail() @IsOptional()
    correo?: string;

    @ApiPropertyOptional({ example: 'ACTIVA', enum: ['ACTIVA', 'INACTIVA', 'BLOQUEADA'] })
    @IsIn(['ACTIVA', 'INACTIVA', 'BLOQUEADA'])
    @IsOptional()
    estado?: string;
}
