import { CompleteOAuthRegistrationDto } from 'src/application/dto/auth/CompleteOAuthRegistrationDto';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { RefreshToken } from 'src/domain/entities/RefreshToken';
import { User } from 'src/domain/entities/User';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { ITokenService } from 'src/domain/services/ITokenService';
import { Email } from 'src/domain/value-objects/Email';

export class CompleteOAuthRegistrationUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepo: IRefreshTokenRepository
  ) {}

  async execute(dto: CompleteOAuthRegistrationDto) {
    const email = new Email(dto.email);

    const exist = await this.userRepo.findByEmail(email.toString());
    if(exist) throw new ConflictError(AUTH_MESSAGES.USER_ALREADY_EXIST);
    
    const newUser = new User({
      email,
      fullName: dto.fullName,
      role: dto.role!,
      avatarUrl: dto.avatarUrl,
      isVerified: true,
      authProvider: dto.provider
    });

    const createdUser = await this.userRepo.create(newUser);

    const payload = {
      sub: createdUser.id!,
      email: createdUser.email.toString(),
      role: createdUser.role
    };

    const accessToken = this.tokenService.signAccessToken(payload);
    const refreshToken = this.tokenService.signRefreshToken(payload);

    const refreshRow = new RefreshToken({
      userId: createdUser.id!,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await this.refreshTokenRepo.create(refreshRow);

    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      accessToken,
      refreshToken,
    };
  };
};
