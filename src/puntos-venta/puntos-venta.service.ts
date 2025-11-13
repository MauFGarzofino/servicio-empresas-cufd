import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PuntoVenta } from './schemas/punto-venta.schema';
import { CreatePuntoVentaDto } from './dto/create-punto-venta.dto';
import { UpdatePuntoVentaDto } from './dto/update-punto-venta.dto';
import { QueryPuntoVentaDto } from './dto/query-punto-venta.dto';
import { CufdVigente } from 'src/common/schemas/cufd-vigente.schema';

@Injectable()
export class PuntosVentaService {
    constructor(
        @InjectModel(PuntoVenta.name) private readonly pvModel: Model<PuntoVenta>,
    ) { }

    async create(nit: string, codigoSucursal: string, dto: CreatePuntoVentaDto) {
        // Buscar último codigoPuntoVenta para esa sucursal
        const lastPv = await this.pvModel
            .findOne({ nit, codigoSucursal })
            .sort({ codigoPuntoVenta: -1 })
            .exec();

        let nextCode = '1';
        if (lastPv) {
            const current = parseInt(lastPv.codigoPuntoVenta, 10) || 0;
            nextCode = String(current + 1);
        }

        const doc = new this.pvModel({
            nit,
            codigoSucursal,
            codigoPuntoVenta: nextCode,
            ...dto,
        });

        try {
            return await doc.save();
        } catch (err: any) {
            if (err.code === 11000) {
                throw new ConflictException(
                    `Ya existe un punto de venta con (nit=${nit}, sucursal=${codigoSucursal}, codigoPuntoVenta=${nextCode})`,
                );
            }
            throw err;
        }
    }

    async findAll(
        nit: string,
        codigoSucursal: string,
        query: QueryPuntoVentaDto,
    ) {
        const filter: FilterQuery<PuntoVenta> = {
            nit,
            codigoSucursal,
        };
        if (query.estado) filter.estado = query.estado;

        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.pvModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ creadoEn: -1 })
                .exec(),
            this.pvModel.countDocuments(filter),
        ]);

        return {
            nit,
            codigoSucursal,
            page,
            limit,
            total,
            items,
        };
    }

    async findOne(
        nit: string,
        codigoSucursal: string,
        codigoPuntoVenta: string,
    ) {
        const pv = await this.pvModel
            .findOne({ nit, codigoSucursal, codigoPuntoVenta })
            .exec();

        if (!pv) {
            throw new NotFoundException(
                `Punto de venta ${codigoPuntoVenta} no encontrado para NIT ${nit} y sucursal ${codigoSucursal}`,
            );
        }

        return pv;
    }

    async update(
        nit: string,
        codigoSucursal: string,
        codigoPuntoVenta: string,
        dto: UpdatePuntoVentaDto,
    ) {
        delete (dto as any).nit;
        delete (dto as any).codigoSucursal;
        delete (dto as any).codigoPuntoVenta;

        const updated = await this.pvModel
            .findOneAndUpdate({ nit, codigoSucursal, codigoPuntoVenta }, dto, {
                new: true,
            })
            .exec();

        if (!updated) {
            throw new NotFoundException(
                `Punto de venta ${codigoPuntoVenta} no encontrado para NIT ${nit} y sucursal ${codigoSucursal}`,
            );
        }

        return updated;
    }

    async remove(
        nit: string,
        codigoSucursal: string,
        codigoPuntoVenta: string,
    ) {
        const deleted = await this.pvModel
            .findOneAndDelete({ nit, codigoSucursal, codigoPuntoVenta })
            .exec();

        if (!deleted) {
            throw new NotFoundException(
                `Punto de venta ${codigoPuntoVenta} no encontrado para NIT ${nit} y sucursal ${codigoSucursal}`,
            );
        }

        return {
            message: 'Punto de venta eliminado correctamente',
            nit,
            codigoSucursal,
            codigoPuntoVenta,
        };
    }

    // --------- CUFD ---------

    async getCufdActual(
        nit: string,
        codigoSucursal: string,
        codigoPuntoVenta: string,
    ) {
        const pv = await this.findOne(nit, codigoSucursal, codigoPuntoVenta);

        return {
            nit,
            codigoSucursal,
            codigoPuntoVenta,
            cufdVigente: pv.cufdVigente ?? null,
        };
    }

    async renovarCufd(
        nit: string,
        codigoSucursal: string,
        codigoPuntoVenta: string,
    ) {
        const pv = await this.findOne(nit, codigoSucursal, codigoPuntoVenta);

        const now = new Date();
        const vigencia = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const randomCode = () =>
            Math.random().toString(36).slice(2, 18).toUpperCase();

        const nuevoCufd: CufdVigente = {
            codigo: randomCode(),
            codigoControl: randomCode(),
            fechaVigencia: vigencia.toISOString(),
            timeVigencia: Math.floor(vigencia.getTime() / 1000),
            mensajesList: null,
            transaccion: true,
        };

        pv.cufdVigente = nuevoCufd;
        await pv.save();

        return {
            nit,
            codigoSucursal,
            codigoPuntoVenta,
            cufdVigente: nuevoCufd,
        };
    }
}
