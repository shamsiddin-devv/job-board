import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { RefreshToken } from 'src/domain/entities/RefreshToken';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { ITokenService } from 'src/domain/services/ITokenService';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken: string) {    
    const existToken = await this.refreshTokenRepo.findByToken(refreshToken);
    if(!existToken) throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);

    if(!existToken.isValid()) throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED_OR_REVOKED);

    existToken.revoke();
    await this.refreshTokenRepo.update(existToken.id!, existToken);
    
    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS
    };
  };
};
