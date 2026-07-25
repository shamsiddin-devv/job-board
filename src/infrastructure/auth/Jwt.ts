import jwt from "jsonwebtoken";
import { ITokenPayload, ITokenService } from "src/domain/services/ITokenService";

export class JsonWebToken implements ITokenService {
  private readonly ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!
  private readonly REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!

  signAccessToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, {expiresIn: '15m'}) 
  }

  signRefreshToken(payload: ITokenPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, {expiresIn: '30d'})
  }

  verifyAccessToken(token: string): ITokenPayload {
    return jwt.verify(token, this.ACCESS_SECRET) as ITokenPayload
  }

  verifyRefreshToken(token: string): ITokenPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as ITokenPayload
  }
}
