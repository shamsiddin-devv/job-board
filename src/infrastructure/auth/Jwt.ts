import jwt from "jsonwebtoken";
import { IJwtPayload, IJwtRepository } from "src/domain/services/ITokenService";

export class JsonWebToken implements IJwtRepository {
  private readonly ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!
  private readonly REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!

  signAccessToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, {expiresIn: '15m'}) 
  }

  signRefreshToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, {expiresIn: '30d'})
  }

  verifyAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, this.ACCESS_SECRET) as IJwtPayload
  }

  verifyRefreshToken(token: string): IJwtPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as IJwtPayload
  }
}
