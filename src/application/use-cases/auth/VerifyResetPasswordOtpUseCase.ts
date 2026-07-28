import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { VerifyOtpUseCase } from './VerifyOtpUseCase';
import { ITokenService } from 'src/domain/services/ITokenService';
import { VerifyOtpUseCaseDto } from 'src/application/dto/auth/VerifyOtpUseCaseDto';
import { Email } from 'src/domain/value-objects/Email';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { AUTH_MESSAGES } from 'src/domain/constants/message';

export class VerifyResetPasswordOtpUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: VerifyOtpUseCaseDto) {
    const email = new Email(dto.emailStr);

    const user = await this.userRepo.findByEmail(email.toString());
    if(!user) throw new UnauthorizedError(AUTH_MESSAGES.INVALID_VERIFICATION);

    await this.verifyOtpUseCase.execute(dto);

    const payload = {
      sub: user.id!,
      email: email.toString(),
    };
    const resetToken = await this.tokenService.signResetToken(payload);

    return {
      message: AUTH_MESSAGES.TOKEN_TIME,
      resetToken
    };
  };
};
