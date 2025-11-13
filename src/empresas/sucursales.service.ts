import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from './schemas/empresa.schema';
import { Model } from 'mongoose';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { generarCodigoCUIS } from 'src/common/utils/cuf-cuis.util';
import { CuisHistorial } from 'src/cuis-historial/schemas/cuis-historial.schema';

@Injectable()
export class SucursalesService {
    constructor(
        @InjectModel(Empresa.name) private readonly empresaModel: Model<Empresa>,
        @InjectModel(CuisHistorial.name) private readonly cuisHistModel: Model<CuisHistorial>,
    ) { }

    async findEmpresaOr404(nit: string) {
        const emp = await this.empresaModel.findOne({ nit }).exec();
        if (!emp) throw new NotFoundException('Empresa no encontrada');
        return emp;
    }

    async create(nit: string, dto: CreateSucursalDto) {
        const empresa = await this.findEmpresaOr404(nit);

        const exists = empresa.sucursales.some(s => s.codigoSucursal === dto.codigoSucursal);
        if (exists) throw new ConflictException('La sucursal ya existe');

        empresa.sucursales.push({
            codigoSucursal: dto.codigoSucursal,
            nombre: dto.nombre,
            direccion: dto.direccion,
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        } as any);

        await empresa.save();
        return empresa.sucursales.find(s => s.codigoSucursal === dto.codigoSucursal);
    }

    async findAll(nit: string) {
        const empresa = await this.findEmpresaOr404(nit);
        return empresa.sucursales;
    }

    async findOne(nit: string, codigoSucursal: string) {
        const empresa = await this.findEmpresaOr404(nit);
        const suc = empresa.sucursales.find(s => s.codigoSucursal === codigoSucursal);
        if (!suc) throw new NotFoundException('Sucursal no encontrada');
        return suc;
    }

    async update(nit: string, codigoSucursal: string, dto: UpdateSucursalDto) {
        const res = await this.empresaModel.findOneAndUpdate(
            { nit, 'sucursales.codigoSucursal': codigoSucursal },
            {
                $set: {
                    'sucursales.$.nombre': dto.nombre,
                    'sucursales.$.direccion': dto.direccion,
                    'sucursales.$.actualizadoEn': new Date(),
                },
            },
            { new: true },
        ).exec();

        if (!res) throw new NotFoundException('Empresa o Sucursal no encontrada');
        return res.sucursales.find(s => s.codigoSucursal === codigoSucursal);
    }

    async remove(nit: string, codigoSucursal: string) {
        const res = await this.empresaModel.findOneAndUpdate(
            { nit },
            { $pull: { sucursales: { codigoSucursal } } },
            { new: true },
        ).exec();

        if (!res) throw new NotFoundException('Empresa no encontrada');
        return { deleted: true, nit, codigoSucursal };
    }

    // -------- CUIS --------

    async getCuisActual(nit: string, codigoSucursal: string) {
        const suc = await this.findOne(nit, codigoSucursal);
        return suc.cuisVigente ?? { vigente: false };
    }

    async renovarCuis(nit: string, codigoSucursal: string) {
        // Generar CUIS simulado
        const nuevo = generarCodigoCUIS(); // { codigo, fechaVigencia, timeVigencia }
        const cuis = {
            ...nuevo,
            mensajesList: null,
            transaccion: true,
        };

        // Set embebido en la sucursal usando positional operator
        const updated = await this.empresaModel.findOneAndUpdate(
            { nit, 'sucursales.codigoSucursal': codigoSucursal },
            {
                $set: {
                    'sucursales.$.cuisVigente': cuis,
                    'sucursales.$.actualizadoEn': new Date(),
                },
            },
            { new: true },
        ).exec();

        if (!updated) throw new NotFoundException('Empresa o Sucursal no encontrada');

        // Guardar historial
        await this.cuisHistModel.create({
            nit,
            codigoSucursal,
            codigo: nuevo.codigo,
            fechaVigencia: nuevo.fechaVigencia,
            timeVigencia: nuevo.timeVigencia,
            mensajesList: null,
            transaccion: true,
            estado: 'ACTIVO',
            emitidoEn: new Date(),
        });

        const suc = updated.sucursales.find(s => s.codigoSucursal === codigoSucursal);
        return suc?.cuisVigente;
    }
}
