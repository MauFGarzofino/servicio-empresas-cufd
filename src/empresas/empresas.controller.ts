import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Empresas')
@Controller('empresas')
@UseGuards(AuthGuard)
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService) { }

    @Post()
    @ApiBody({
        description: 'Crear empresa',
        examples: {
            ACME: {
                summary: 'Ejemplo ACME SRL',
                value: {
                    nit: '1020304050',
                    razonSocial: 'ACME SRL',
                    correo: 'contacto@acme.bo',
                    estado: 'ACTIVA',
                },
            },
        },
    })
    @ApiCreatedResponse({ description: 'Empresa creada' })
    @ApiBadRequestResponse({ description: 'Validación fallida' })
    @ApiConflictResponse({ description: 'NIT duplicado' })
    create(@Body() dto: CreateEmpresaDto) {
        return this.empresasService.create(dto);
    }

    @Get()
    @ApiOkResponse({ description: 'Listado de empresas' })
    findAll() {
        return this.empresasService.findAll();
    }

    @Get(':nit')
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiOkResponse({ description: 'Empresa encontrada' })
    @ApiNotFoundResponse({ description: 'Empresa no existe' })
    findOne(@Param('nit') nit: string) {
        return this.empresasService.findOne(nit);
    }

    @Patch(':nit')
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiBody({
        description: 'Actualizar empresa',
        examples: {
            ActualizarRazonSocial: {
                value: { razonSocial: 'ACME Bolivia SRL', estado: 'ACTIVA' },
            },
        },
    })
    @ApiOkResponse({ description: 'Empresa actualizada' })
    @ApiNotFoundResponse({ description: 'Empresa no existe' })
    update(@Param('nit') nit: string, @Body() dto: UpdateEmpresaDto) {
        return this.empresasService.update(nit, dto);
    }

    @Delete(':nit')
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiOkResponse({ description: 'Empresa eliminada' })
    @ApiNotFoundResponse({ description: 'Empresa no existe' })
    @HttpCode(HttpStatus.OK)
    remove(@Param('nit') nit: string) {
        return this.empresasService.remove(nit);
    }
}
