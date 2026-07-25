import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import type { ITokenService } from 'src/domain/services/ITokenService';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('ITokenService') private readonly tokenService: ITokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_NOT_FOUND);

    try {
      const payload = this.tokenService.verifyAccessToken(authHeader);
      request.user = payload;
      return true;
    }catch(err) {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
    };
  };
};
