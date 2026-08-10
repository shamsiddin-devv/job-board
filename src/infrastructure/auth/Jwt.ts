import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { IResetPasswordTokenPayload, ITokenPayload, ITokenService } from "src/domain/services/ITokenService";

@Injectable()
export class JsonWebToken implements ITokenService {
  constructor(private readonly configService: ConfigService) {};

  signAccessToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'), {expiresIn: this.configService.get('ACCESS_TOKEN_TIME'), jwtid: randomUUID()}) 
  }

  signRefreshToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'), {expiresIn: this.configService.get('REFRESH_TOKEN_TIME'), jwtid: randomUUID()})
  }

  signResetToken(payload: IResetPasswordTokenPayload): string {
    return jwt.sign(payload, this.configService.getOrThrow<string>('RESET_TOKEN_SECRET'), {expiresIn: this.configService.get('RESET_TOKEN_TIME')})
  }

  verifyAccessToken(token: string): ITokenPayload {
    return jwt.verify(token, this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET')) as ITokenPayload
  }

  verifyRefreshToken(token: string): ITokenPayload {
    return jwt.verify(token, this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET')) as ITokenPayload
  }

  verifyResetToken(token: string): IResetPasswordTokenPayload {
    return jwt.verify(token, this.configService.getOrThrow<string>('RESET_TOKEN_SECRET')) as IResetPasswordTokenPayload
  }
}
