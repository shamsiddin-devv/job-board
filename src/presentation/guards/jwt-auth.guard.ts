import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import type { ITokenService } from 'src/domain/services/ITokenService';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('ITokenService') private readonly tokenService: ITokenService,
    @Inject('IUserRepository') private readonly users: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_NOT_FOUND);

    const token = authHeader.slice('Bearer '.length).trim();

    let payload;
    try {
      payload = this.tokenService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
    }
    const user = await this.users.findById(payload.sub);
    if (!user?.isActive || !user.isVerified) {
      throw new UnauthorizedError(AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }
    request.user = { ...payload, role: user.role, email: user.email.toString() };
    return true;
  };
};
