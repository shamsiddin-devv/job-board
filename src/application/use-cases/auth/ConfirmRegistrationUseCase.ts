import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { VerifyOtpUseCase } from './VerifyOtpUseCase';
import { Email } from 'src/domain/value-objects/Email';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { VerifyOtpUseCaseDto } from 'src/application/dto/auth/VerifyOtpUseCaseDto';
import { NotFoundError } from 'src/domain/errors/NotFoundError';

export class ConfirmRegistrationUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly verifyOtp: VerifyOtpUseCase,
  ) {}

  async execute(dto: VerifyOtpUseCaseDto) {
    const verifyEmail = new Email(dto.emailStr);

    const user = await this.userRepo.findByEmail(verifyEmail.toString());
    if(!user) throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);

    await this.verifyOtp.execute(dto);
    user.markAsVerified();
    await this.userRepo.update(user.id!, user);

    return {
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      user: {
        id: user.id,
        email: user.email.toString(),
        fullName: user.fullName,
        role: user.role,
      },
    };
  };
};
