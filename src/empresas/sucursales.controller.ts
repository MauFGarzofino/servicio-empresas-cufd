import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { SucursalesService } from './sucursales.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@ApiTags('Sucursales')
@Controller('empresas/:nit/sucursales')
export class SucursalesController {
    constructor(private readonly service: SucursalesService) { }

    @Post()
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiBody({
        description: 'Crear sucursal embebida en Empresa',
        examples: { ejemplo: { value: { codigoSucursal: '001', nombre: 'Sucursal Central', direccion: 'Av. Heroínas 123' } } },
    })
    @ApiOkResponse({ description: 'Sucursal creada' })
    @ApiBadRequestResponse({ description: 'Validación fallida' })
    @ApiConflictResponse({ description: 'La sucursal ya existe en la empresa' })
    create(@Param('nit') nit: string, @Body() dto: CreateSucursalDto) {
        return this.service.create(nit, dto);
    }

    @Get()
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiOkResponse({ description: 'Lista de sucursales' })
    findAll(@Param('nit') nit: string) {
        return this.service.findAll(nit);
    }

    @Get(':codigoSucursal')
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiParam({ name: 'codigoSucursal', example: '001' })
    @ApiOkResponse({ description: 'Sucursal encontrada' })
    @ApiNotFoundResponse({ description: 'No existe' })
    findOne(@Param('nit') nit: string, @Param('codigoSucursal') codigoSucursal: string) {
        return this.service.findOne(nit, codigoSucursal);
    }

    @Patch(':codigoSucursal')
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiParam({ name: 'codigoSucursal', example: '001' })
    @ApiOkResponse({ description: 'Sucursal actualizada' })
    @ApiNotFoundResponse({ description: 'No existe' })
    update(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Body() dto: UpdateSucursalDto,
    ) {
        return this.service.update(nit, codigoSucursal, dto);
    }

    @Delete(':codigoSucursal')
    @ApiParam({ name: 'nit', example: '1020304050' })
    @ApiParam({ name: 'codigoSucursal', example: '001' })
    @ApiOkResponse({ description: 'Sucursal eliminada' })
    @ApiNotFoundResponse({ description: 'No existe' })
    @HttpCode(HttpStatus.OK)
    remove(@Param('nit') nit: string, @Param('codigoSucursal') codigoSucursal: string) {
        return this.service.remove(nit, codigoSucursal);
    }

    // ---- CUIS ----

    @Get(':codigoSucursal/cuis/actual')
    @ApiOkResponse({ description: 'CUIS vigente (si existe)' })
    @ApiNotFoundResponse({ description: 'Empresa/Sucursal no existe' })
    getCuisActual(@Param('nit') nit: string, @Param('codigoSucursal') codigoSucursal: string) {
        return this.service.getCuisActual(nit, codigoSucursal);
    }

    @Post(':codigoSucursal/cuis/renovar')
    @ApiOkResponse({ description: 'CUIS renovado y persistido' })
    @ApiNotFoundResponse({ description: 'Empresa/Sucursal no existe' })
    renovarCuis(@Param('nit') nit: string, @Param('codigoSucursal') codigoSucursal: string) {
        return this.service.renovarCuis(nit, codigoSucursal);
    }
}
