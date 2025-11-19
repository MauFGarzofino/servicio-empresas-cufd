import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { sendLog } from './logstash.logger';

@Injectable()
export class LogstashInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();
        const { method, url } = req;

        const timestamp = new Date().toISOString();

        return next.handle().pipe(
            tap((data) => {
                sendLog({
                    level: 'INFO',
                    message: 'Request handled successfully',
                    route: url,
                    method,
                    statusCode: 200,
                    timestamp,
                    service: 'servicio-empresas-cufd',
                });
            }),
            catchError((error) => {
                sendLog({
                    level: 'ERROR',
                    message: error.message || 'Request failed',
                    route: url,
                    method,
                    statusCode: error.status || 500,
                    timestamp,
                    service: 'servicio-empresas-cufd',
                });
                return throwError(() => error);
            }),
        );
    }
}
