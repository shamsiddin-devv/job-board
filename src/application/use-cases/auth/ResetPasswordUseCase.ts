import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { IHashService } from 'src/domain/services/IHashService';
import { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository';
import { ResetPasswordUseCaseDto } from 'src/application/dto/auth/ResetPasswordUseCaseDto';
import { ITokenService } from 'src/domain/services/ITokenService';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { VerifyOtpUseCase } from './VerifyOtpUseCase';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashService,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: ResetPasswordUseCaseDto) {
    const verifyToken = this.tokenService.verifyResetToken(dto.resetToken);
    if(!verifyToken) throw new NotFoundError(AUTH_MESSAGES.TOKEN_NOT_FOUND);

    const user = await this.userRepo.findById(verifyToken.sub);
    if(!user) throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
    
    const hashPassword = await this.hashService.hash(dto.newPassword);

    await this.userRepo.updateHashPassword(user.id!, hashPassword);
    await this.refreshTokenRepo.updateManyByUserId(user.id!, true);

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
    };
  };
};
