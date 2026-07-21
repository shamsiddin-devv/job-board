import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { VerifyOtpUseCase } from './VerifyOtpUseCase';
import { ITokenService } from 'src/domain/services/ITokenService';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';
import { Email } from 'src/domain/value-objects/Email';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { RefreshToken } from 'src/domain/entities/RefreshToken';

export class ConfirmRegistrationUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly verifyOtp: VerifyOtpUseCase,
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(emailStr: string, code: string) {
    const verifyEmail = new Email(emailStr);

    const user = await this.userRepo.findByEmail(verifyEmail.toString());
    if (!user) throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);

    await this.verifyOtp.execute(user.email.toString(), code);
    user.markAsVerified();
    await this.userRepo.update(user.id!, user);

    const payload = {
      sub: user.id!,
      email: user.email.toString(),
      role: user.role,
    };
    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signRefreshToken(payload);

    const refreshRow = new RefreshToken({
      userId: user.id!,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    
    await this.refreshTokenRepo.create(refreshRow);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email.toString(),
        name: user.name,
        role: user.role,
      },
    };
  };
};
