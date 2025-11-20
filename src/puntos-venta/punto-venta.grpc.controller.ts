import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PuntosVentaService } from './puntos-venta.service';

@Controller()
export class PuntosVentaGrpcController {
    constructor(private readonly service: PuntosVentaService) { }

    /* ---------------- GET PUNTO DE VENTA ---------------- */
    @GrpcMethod('PuntoVentaService', 'GetPuntoVenta')
    async getPuntoVenta(data: any) {
        const pv = await this.service.findOne(
            data.nit,
            data.codigoSucursal,
            data.codigoPuntoVenta,
        );

        return {
            nit: pv.nit,
            codigoSucursal: pv.codigoSucursal,
            codigoPuntoVenta: pv.codigoPuntoVenta,
            estado: pv.estado ?? '',
        };
    }

    /* ---------------- GET CUFD ACTUAL ---------------- */
    @GrpcMethod('PuntoVentaService', 'GetCufdActual')
    async getCufdActual(data: any) {
        const pv = await this.service.findOne(
            data.nit,
            data.codigoSucursal,
            data.codigoPuntoVenta,
        );

        if (!pv.cufdVigente) {
            return {
                codigo: '',
                codigoControl: '',
                fechaVigencia: '',
                transaccion: false,
                existe: false,
            };
        }

        return {
            codigo: pv.cufdVigente.codigo,
            codigoControl: pv.cufdVigente.codigoControl,
            fechaVigencia: pv.cufdVigente.fechaVigencia,
            transaccion: pv.cufdVigente.transaccion,
            existe: true,
        };
    }

    /* ---------------- VALIDAR CUFD ---------------- */
    @GrpcMethod('PuntoVentaService', 'ValidarCufd')
    async validarCufd(data: any) {
        const pv = await this.service.findOne(
            data.nit,
            data.codigoSucursal,
            data.codigoPuntoVenta,
        );

        const vigente = pv.cufdVigente;

        if (!vigente) {
            return {
                valido: false,
                motivo: 'No existe CUFD vigente',
                fechaVigencia: '',
            };
        }

        if (vigente.codigo !== data.cufd) {
            return {
                valido: false,
                motivo: 'CUFD no coincide con el vigente',
                fechaVigencia: vigente.fechaVigencia,
            };
        }

        // Comparar fechas
        const exp = new Date(vigente.fechaVigencia).getTime();
        if (Date.now() > exp) {
            return {
                valido: false,
                motivo: 'CUFD vencido',
                fechaVigencia: vigente.fechaVigencia,
            };
        }

        return {
            valido: true,
            motivo: '',
            fechaVigencia: vigente.fechaVigencia,
        };
    }
}
