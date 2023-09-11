import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FirebaseAuthService } from './firebase.auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private readonly firebaseAuthService: FirebaseAuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let token = request.headers.authorization;
        if (!token) {
            return false;
        }

        token = token.replace('Bearer ', '');

        const result = await this.firebaseAuthService.verifySessionToken(token);

        if (result.isValid && result.email) {
            request.user = { email: result.email }
            return true;
        }

        return false;
    }
}