import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { Empresa, EmpresaSchema } from './schemas/empresa.schema';
import { AuthGrpcClient } from 'src/grpc/auth.grpc';

@Module({
    imports: [MongooseModule.forFeature([{ name: Empresa.name, schema: EmpresaSchema }])],
    controllers: [EmpresasController],
    providers: [EmpresasService, AuthGrpcClient],
})
export class EmpresasModule { }
