import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

interface VerifyTokenRequest {
    token: string;
}

interface VerifyTokenResponse {
    valid: boolean;
    user_id: string;
    username: string;
}

interface AuthGrpcService {
    VerifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse>;
}

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'auth',
            protoPath: join(__dirname, '../../proto/auth.proto'),
            url: 'auth-service:50051',
        },
    })
    private client: ClientGrpc;

    private authService: AuthGrpcService;

    onModuleInit() {
        this.authService = this.client.getService<AuthGrpcService>('AuthService');
    }

    verifyToken(token: string) {
        return this.authService.VerifyToken({ token });
    }
}
