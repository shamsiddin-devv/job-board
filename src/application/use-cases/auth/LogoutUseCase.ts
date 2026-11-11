import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(refreshToken?: string) {
    const existToken = refreshToken ? await this.refreshTokenRepo.findByToken(refreshToken) : null;
    if (existToken?.isValid()) {
      existToken.revoke();
      await this.refreshTokenRepo.update(existToken.id!, existToken);
    }
    
    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS
    };
  };
};
