import { OAuthLoginDto } from 'src/application/dto/auth/OAuthLoginDto';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { RefreshToken } from 'src/domain/entities/RefreshToken';
import { User } from 'src/domain/entities/User';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { ITokenService } from 'src/domain/services/ITokenService';
import { Email } from 'src/domain/value-objects/Email';

export class OAuthLoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: OAuthLoginDto) {
    const verifyEmail = new Email(dto.email);

    let exist = await this.userRepo.findByEmail(verifyEmail.toString());

    if (!exist) {
      return {
        requiresRoleSelection: true,
        profile: { email: dto.email, name: dto.fullName, avatarUrl: dto.avatarUrl }
      };
    };

    if (exist.authProvider === 'local') throw new UnauthorizedError(AUTH_MESSAGES.REGISTERED_WITH_PROVIDER);

    if (!exist.isActive) throw new UnauthorizedError(AUTH_MESSAGES.ACCOUNT_INACTIVE);

    const payload = {
      sub: exist.id!,
      email: exist.email.toString(),
      role: exist.role,
    };

    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signRefreshToken(payload);

    const refreshRow = new RefreshToken({
      userId: exist.id!,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await this.refreshTokenRepo.create(refreshRow);

    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      accessToken,
      refreshToken,
      user: {
        id: exist.id,
        email: exist.email.toString(),
        fullname: exist.fullName,
        avatarUrl: exist.avatarUrl,
        role: exist.role
      }
    };
  }
}