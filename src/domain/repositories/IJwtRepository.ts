import { UserRoles } from '../entities/User';

export interface IJwtPayload {
  sub: string;
  email: string;
  role: UserRoles;
  iat?: number;
  exp?: number;
}

export interface IJwtRepository {
  signAccessToken(payload: IJwtPayload): string;
  signRefreshToken(payload: IJwtPayload): string;
  verifyAccessToken(token: string): IJwtPayload;
  verifyRefreshToken(token: string): IJwtPayload;
}
