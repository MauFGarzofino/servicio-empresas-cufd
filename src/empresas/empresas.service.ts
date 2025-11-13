import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Empresa } from './schemas/empresa.schema';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
    constructor(@InjectModel(Empresa.name) private empresaModel: Model<Empresa>) { }

    async create(dto: CreateEmpresaDto) {
        try {
            // normalizaciones básicas
            dto.nit = dto.nit.trim();
            dto.razonSocial = dto.razonSocial.trim();

            const doc = new this.empresaModel(dto);
            return await doc.save();
        } catch (err: any) {
            // E11000 duplicate key error index: nit_1 dup key
            if (err?.code === 11000) {
                throw new ConflictException('El NIT ya existe');
            }
            throw err;
        }
    }

    findAll() {
        return this.empresaModel.find().exec();
    }

    async findOne(nit: string) {
        const empresa = await this.empresaModel.findOne({ nit }).exec();
        if (!empresa) throw new NotFoundException('Empresa no encontrada');
        return empresa;
    }

    async update(nit: string, dto: UpdateEmpresaDto) {
        if (dto.razonSocial) dto.razonSocial = dto.razonSocial.trim();
        const empresa = await this.empresaModel
            .findOneAndUpdate({ nit }, dto, { new: true })
            .exec();
        if (!empresa) throw new NotFoundException('Empresa no encontrada');
        return empresa;
    }

    async remove(nit: string) {
        const empresa = await this.empresaModel.findOneAndDelete({ nit }).exec();
        if (!empresa) throw new NotFoundException('Empresa no encontrada');
        return { deleted: true, nit };
    }
}