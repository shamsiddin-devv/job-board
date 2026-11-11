import { createHash } from 'node:crypto';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { IHashService } from 'src/domain/services/IHashService';
import { ResetPasswordUseCaseDto } from 'src/application/dto/auth/ResetPasswordUseCaseDto';
import { ITokenService } from 'src/domain/services/ITokenService';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: ResetPasswordUseCaseDto) {
    let verifyToken;
    try {
      verifyToken = this.tokenService.verifyResetToken(dto.resetToken);
    } catch {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
    }

    const user = await this.userRepo.findById(verifyToken.sub);
    if (!user?.isActive || !user.isVerified || user.isOAuthUser()) throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
    
    const previousHash = await this.userRepo.findPasswordHashByUserId(user.id!);
    if (!previousHash || createHash('sha256').update(previousHash).digest('hex') !== verifyToken.credentialVersion) {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
    }
    const hashPassword = await this.hashService.hash(dto.newPassword);

    if (!await this.userRepo.resetPassword(user.id!, previousHash, hashPassword)) {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
    }

    return {
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
    };
  };
};
