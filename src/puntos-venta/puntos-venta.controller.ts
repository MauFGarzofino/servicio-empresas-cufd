import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PuntosVentaService } from './puntos-venta.service';
import { CreatePuntoVentaDto } from './dto/create-punto-venta.dto';
import { UpdatePuntoVentaDto } from './dto/update-punto-venta.dto';
import { QueryPuntoVentaDto } from './dto/query-punto-venta.dto';

@ApiTags('Puntos de Venta')
@Controller('puntos-venta')
export class PuntosVentaController {
    constructor(private readonly service: PuntosVentaService) { }

    @Post()
    create(@Body() dto: CreatePuntoVentaDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiQuery({ name: 'nit', required: false })
    @ApiQuery({ name: 'codigoSucursal', required: false })
    @ApiQuery({ name: 'estado', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(@Query() query: QueryPuntoVentaDto) {
        return this.service.findAll(query);
    }

    @Get(':nit/:codigoSucursal/:codigoPuntoVenta')
    findOne(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
    ) {
        return this.service.findOne(nit, codigoSucursal, codigoPuntoVenta);
    }

    @Patch(':nit/:codigoSucursal/:codigoPuntoVenta')
    update(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
        @Body() dto: UpdatePuntoVentaDto,
    ) {
        return this.service.update(nit, codigoSucursal, codigoPuntoVenta, dto);
    }

    @Delete(':nit/:codigoSucursal/:codigoPuntoVenta')
    remove(
        @Param('nit') nit: string,
        @Param('codigoSucursal') codigoSucursal: string,
        @Param('codigoPuntoVenta') codigoPuntoVenta: string,
    ) {
        return this.service.remove(nit, codigoSucursal, codigoPuntoVenta);
    }
}
