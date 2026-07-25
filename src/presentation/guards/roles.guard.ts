import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AUTH_MESSAGES } from "src/domain/constants/message";
import { ForbiddenError } from "src/domain/errors/ForbiddenError";


export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {};

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if(!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!requiredRoles.includes(user.role)) throw new ForbiddenError(AUTH_MESSAGES.FORBIDDEN);
    return true
  };
};