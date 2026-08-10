import { VerifyOtpUseCaseDto } from 'src/application/dto/auth/VerifyOtpUseCaseDto';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { BadRequestError } from 'src/domain/errors/BadRequestError';
import { IOtpRepository } from 'src/domain/repositories/IOtpRepository';
import { Email } from 'src/domain/value-objects/Email';

export class VerifyOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
  ) {}

  async execute(dto: VerifyOtpUseCaseDto): Promise<Boolean> {
    const email = new Email(dto.emailStr);

    const savedCode = await this.otpRepo.find(email.toString());
    if(!savedCode) throw new BadRequestError(AUTH_MESSAGES.OTP_NOT_FOUND_OR_EXPIRED);

    if(savedCode !== dto.inputCode) throw new BadRequestError(AUTH_MESSAGES.OTP_INVALID);

    await this.otpRepo.delete(email.toString());

    return true;
  };
}
