import { UserRoles } from '../entities/User';

export interface ITokenPayload {
  sub: string;
  email: string;
  role: UserRoles;
  iat?: number;
  exp?: number;
};

export interface IResetPasswordTokenPayload {
  sub: string,
  email: string,
  iat?: number;
  exp?: number;
}

export interface ITokenService {
  signAccessToken(payload: ITokenPayload): string;
  signRefreshToken(payload: ITokenPayload): string;
  signResetToken(payload: IResetPasswordTokenPayload): string
  verifyAccessToken(token: string): ITokenPayload;
  verifyRefreshToken(token: string): ITokenPayload;
  verifyResetToken(token: string): IResetPasswordTokenPayload;
}
