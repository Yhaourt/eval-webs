import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Vérifier le contexte GraphQL
    const gqlContext = context.getArgByIndex(2); // Récupère le contexte de la requête GraphQL

    // Accéder à l'en-tête Authorization dans le contexte de la requête
    const authHeader = gqlContext?.req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    const isValid = await this.authService.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
