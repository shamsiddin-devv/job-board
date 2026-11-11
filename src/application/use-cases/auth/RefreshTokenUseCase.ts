import { AUTH_MESSAGES, USER_MESSAGES } from 'src/domain/constants/message';
import { RefreshToken } from 'src/domain/entities/RefreshToken';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { ITokenService } from 'src/domain/services/ITokenService';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_NOT_FOUND);

    let oldPayload;
    try {
      oldPayload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);
    }
    if(!oldPayload) throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);

    const existToken = await this.refreshTokenRepo.findByToken(refreshToken);
    if(!existToken) throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_NOT_FOUND);

    if(!existToken.isValid()) throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);

    if(existToken.userId !== oldPayload.sub) throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);
    
    const user = await this.userRepo.findById(existToken.userId);
    if (!user?.isActive || !user.isVerified) throw new UnauthorizedError(USER_MESSAGES.USER_INACTIVE);
    
    const newPayload = {
      sub: user.id!,
      email: user.email.toString(),
      role: user.role
    };
    const newAccessToken = this.tokenService.signAccessToken(newPayload);
    const newRefreshToken = this.tokenService.signRefreshToken(newPayload);

    const refreshRow = new RefreshToken({
      userId: user.id!,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })

    if (!await this.refreshTokenRepo.rotate(existToken.id!, refreshRow)) {
      throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_INVALID);
    }
    return {
      message: AUTH_MESSAGES.REFRESH_SUCCESS,
      newAccessToken,
      newRefreshToken
    };
  };
};