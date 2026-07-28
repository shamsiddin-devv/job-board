import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { SendOtpUseCase } from './SendOtpUseCase';
import { Email } from 'src/domain/value-objects/Email';
import { AUTH_MESSAGES } from 'src/domain/constants/message';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly sendOtpUseCase: SendOtpUseCase,
  ) {};

  async execute(emailStr: string) {
    const email = new Email(emailStr);

    const user = await this.userRepo.findByEmail(email.toString());
    if(!user) return {message: AUTH_MESSAGES.OTP_SENT};

    if(user.authProvider !== 'local') return {message: AUTH_MESSAGES.OTP_SENT};

    await this.sendOtpUseCase.execute(email.toString());
    return {message: AUTH_MESSAGES.OTP_SENT};
  };
}
