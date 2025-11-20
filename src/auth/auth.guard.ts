import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGrpcClient } from '../grpc/auth.grpc';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authGrpc: AuthGrpcClient) { }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];

        if (!authHeader) throw new UnauthorizedException('Missing Authorization header');

        const token = authHeader.replace('Bearer ', '');

        const result = await this.authGrpc.verifyToken(token);

        if (!result.valid) throw new UnauthorizedException('Invalid token');

        // Guardar datos del usuario en la request
        req.user = {
            id: result.user_id,
            username: result.username,
        };

        return true;
    }
}
