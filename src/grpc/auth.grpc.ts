import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable, firstValueFrom } from 'rxjs';

interface VerifyTokenRequest {
    token: string;
}

interface VerifyTokenResponse {
    valid: boolean;
    user_id: string;
    username: string;
}

interface AuthGrpcService {
    verifyToken(data: VerifyTokenRequest): Observable<VerifyTokenResponse>;
}

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
    private readonly logger = new Logger(AuthGrpcClient.name);

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'auth',
            protoPath: join(__dirname, '../../proto/auth.proto'),
            url: 'auth-service:50051', // dentro de la red Docker
        },
    })
    private client: ClientGrpc;

    private authService: AuthGrpcService;

    onModuleInit() {
        this.logger.log('Inicializando cliente gRPC de AuthService...');

        this.authService = this.client.getService<AuthGrpcService>('AuthService');

        // Log de sanity-check
        const methods = Object.keys(this.authService as any);
        this.logger.log(`Métodos disponibles en AuthService gRPC: ${methods.join(', ')}`);
    }

    async verifyToken(token: string): Promise<VerifyTokenResponse> {
        this.logger.log(`Llamando a verifyToken() con token: ${token}`);

        try {
            const result = await firstValueFrom(
                this.authService.verifyToken({ token }),
            );

            this.logger.log(`Respuesta gRPC: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            this.logger.error(
                `Error al llamar a verifyToken() → ${error.message}`,
                (error as any).stack,
            );
            throw error;
        }
    }
}
