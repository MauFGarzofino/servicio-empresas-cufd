import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiQuery,
    ApiOperation,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiParam,
} from '@nestjs/swagger';
import { PuntosVentaService } from './puntos-venta.service';
import { CreatePuntoVentaDto } from './dto/create-punto-venta.dto';
import { UpdatePuntoVentaDto } from './dto/update-punto-venta.dto';
import { QueryPuntoVentaDto } from './dto/query-punto-venta.dto';

@ApiTags('Puntos de Venta')
@Controller('empresas/:nit/sucursales/:codigoSucursal/puntos-venta')
export class PuntosVentaController {
    constructor(private readonly service: PuntosVentaService) { }

    // ---------- Crear ----------
    @Post()
    @ApiOperation({
        summary: 'Registrar un nuevo punto de venta',
        description:
            'Crea un punto de venta asociado a una sucursal de una empresa (NIT + código de sucursal). El código de punto de venta lo genera el sistema.',
    })
    @ApiParam({ name: 'nit', description: 'NIT de la empresa', example: '1020304050' })
    @ApiParam({ name: 'codigoSucursal', description: 'Código de sucursal', example: '0' })
    @ApiCreatedResponse({
        description: 'Punto de venta creado correctamente',
    })
    @ApiConflictResponse({
        description:
            'Ya existe un punto de venta con el mismo (nit, codigoSucursal, codigoPuntoVenta)',
    })
    create(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Body() dto: CreatePuntoVentaDto,
    ) {
        return this.service.create(nit, codigoSucursal, dto);
    }

    // ---------- Listar ----------
    @Get()
    @ApiOperation({
        summary: 'Listar puntos de venta de una sucursal',
        description:
            'Devuelve una lista paginada de puntos de venta de una empresa y sucursal específica.',
    })
    @ApiParam({ name: 'nit', description: 'NIT de la empresa', example: '1020304050' })
    @ApiParam({ name: 'codigoSucursal', description: 'Código de sucursal', example: '0' })
    @ApiQuery({
        name: 'estado',
        required: false,
        description: 'Estado del punto de venta (ACTIVO, INACTIVO, etc.)',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número de página (paginación)',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Tamaño de página (máx 100)',
    })
    @ApiOkResponse({
        description:
            'Lista paginada de puntos de venta de la sucursal indicada.',
    })
    findAll(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Query() query: QueryPuntoVentaDto,
    ) {
        return this.service.findAll(nit, codigoSucursal, query);
    }

    // ---------- Obtener uno ----------
    @Get(':codigoPuntoVenta')
    @ApiOperation({
        summary: 'Obtener un punto de venta por clave natural',
        description:
            'Devuelve el punto de venta identificado por (NIT, código de sucursal y código de punto de venta).',
    })
    @ApiParam({ name: 'nit', description: 'NIT de la empresa' })
    @ApiParam({ name: 'codigoSucursal', description: 'Código de sucursal' })
    @ApiParam({ name: 'codigoPuntoVenta', description: 'Código de punto de venta' })
    @ApiOkResponse({ description: 'Punto de venta encontrado' })
    @ApiNotFoundResponse({ description: 'Punto de venta no encontrado' })
    findOne(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
    ) {
        return this.service.findOne(nit, codigoSucursal, codigoPuntoVenta);
    }

    // ---------- Actualizar ----------
    @Patch(':codigoPuntoVenta')
    @ApiOperation({
        summary: 'Actualizar datos de un punto de venta',
        description:
            'Actualiza los campos editables de un punto de venta. No se permite modificar NIT, código de sucursal ni código de punto de venta.',
    })
    @ApiOkResponse({ description: 'Punto de venta actualizado' })
    @ApiNotFoundResponse({ description: 'Punto de venta no encontrado' })
    update(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
        @Body() dto: UpdatePuntoVentaDto,
    ) {
        return this.service.update(nit, codigoSucursal, codigoPuntoVenta, dto);
    }

    // ---------- Eliminar ----------
    @Delete(':codigoPuntoVenta')
    @ApiOperation({
        summary: 'Eliminar un punto de venta',
        description:
            'Elimina físicamente un punto de venta de la sucursal indicada.',
    })
    @ApiOkResponse({ description: 'Punto de venta eliminado correctamente' })
    @ApiNotFoundResponse({ description: 'Punto de venta no encontrado' })
    remove(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
    ) {
        return this.service.remove(nit, codigoSucursal, codigoPuntoVenta);
    }

    // ---------- CUFD: Actual ----------
    @Get(':codigoPuntoVenta/cufd/actual')
    @ApiOperation({
        summary: 'Obtener CUFD vigente de un punto de venta',
        description:
            'Devuelve el CUFD vigente embebido en el punto de venta (si existe).',
    })
    @ApiOkResponse({
        description: 'CUFD vigente devuelto (o null si aún no fue generado).',
    })
    @ApiNotFoundResponse({
        description: 'Punto de venta no encontrado para el NIT y sucursal dados',
    })
    getCufdActual(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
    ) {
        return this.service.getCufdActual(nit, codigoSucursal, codigoPuntoVenta);
    }

    // ---------- CUFD: Renovar ----------
    @Post(':codigoPuntoVenta/cufd/renovar')
    @ApiOperation({
        summary: 'Renovar CUFD de un punto de venta',
        description:
            'Simula la solicitud de un nuevo CUFD (código de control diario) para el punto de venta. El CUFD generado se guarda como cufdVigente.',
    })
    @ApiOkResponse({
        description: 'CUFD renovado y persistido como vigente en el punto de venta.',
    })
    @ApiNotFoundResponse({
        description: 'Punto de venta no encontrado para el NIT y sucursal dados',
    })
    renovarCufd(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
    ) {
        return this.service.renovarCufd(nit, codigoSucursal, codigoPuntoVenta);
    }
}
