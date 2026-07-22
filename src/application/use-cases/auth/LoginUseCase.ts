import { LoginDto } from 'src/application/dto/auth/LoginDto';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { RefreshToken } from 'src/domain/entities/RefreshToken';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { IHashService } from 'src/domain/services/IHashService';
import { ITokenService } from 'src/domain/services/ITokenService';
import { Email } from 'src/domain/value-objects/Email';

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly tokenService: ITokenService,
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: LoginDto) {
    const verifyEmail = new Email(dto.email);

    const exist = await this.userRepo.findByEmail(verifyEmail.toString());
    if(!exist) throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);

    const passwordHash = await this.userRepo.findPasswordHashByUserId(exist.id!);

    const comparePassword = await this.hashService.compare(dto.password, passwordHash!);
    if(!comparePassword) throw new UnauthorizedError(AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD);

    const payload = {
      sub: exist.id!,
      email: exist.email.toString(),
      role: exist.role
    };

    const accessToken = await this.tokenService.signAccessToken(payload);
    const refreshToken = await this.tokenService.signRefreshToken(payload);

    const refreshRow = new RefreshToken({
      userId: exist.id!,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 24 * 30 * 60 * 60 * 1000)
    });

    await this.refreshTokenRepo.create(refreshRow);

    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      accessToken,
    };
  };
};
