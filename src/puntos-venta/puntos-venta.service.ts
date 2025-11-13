import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { PuntoVenta } from './schemas/punto-venta.schema';
import { CreatePuntoVentaDto } from './dto/create-punto-venta.dto';
import { UpdatePuntoVentaDto } from './dto/update-punto-venta.dto';
import { QueryPuntoVentaDto } from './dto/query-punto-venta.dto';

@Injectable()
export class PuntosVentaService {
    constructor(
        @InjectModel(PuntoVenta.name) private readonly pvModel: Model<PuntoVenta>,
    ) { }

    async create(dto: CreatePuntoVentaDto) {
        const doc = new this.pvModel(dto);
        return doc.save();
    }

    async findAll(query: QueryPuntoVentaDto) {
        const filter: FilterQuery<PuntoVenta> = {};
        if (query.nit) filter.nit = query.nit;
        if (query.codigoSucursal) filter.codigoSucursal = query.codigoSucursal;
        if (query.estado) filter.estado = query.estado;

        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.pvModel.find(filter).skip(skip).limit(limit).sort({ creadoEn: -1 }).exec(),
            this.pvModel.countDocuments(filter),
        ]);

        return {
            page,
            limit,
            total,
            items,
        };
    }

    async findOne(nit: string, codigoSucursal: string, codigoPuntoVenta: string) {
        return this.pvModel.findOne({ nit, codigoSucursal, codigoPuntoVenta }).exec();
    }

    async update(
        nit: string,
        codigoSucursal: string,
        codigoPuntoVenta: string,
        dto: UpdatePuntoVentaDto,
    ) {
        // No permitir el cambio de las pk compuestas
        delete (dto as any).nit;
        delete (dto as any).codigoSucursal;
        delete (dto as any).codigoPuntoVenta;

        return this.pvModel
            .findOneAndUpdate({ nit, codigoSucursal, codigoPuntoVenta }, dto, { new: true })
            .exec();
    }

    async remove(nit: string, codigoSucursal: string, codigoPuntoVenta: string) {
        return this.pvModel
            .findOneAndDelete({ nit, codigoSucursal, codigoPuntoVenta })
            .exec();
    }
}
