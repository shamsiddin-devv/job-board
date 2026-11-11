import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { ForbiddenError } from 'src/domain/errors/ForbiddenError';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user || !roles.includes(user.role)) throw new ForbiddenError(AUTH_MESSAGES.FORBIDDEN);
    return true;
  }
}
