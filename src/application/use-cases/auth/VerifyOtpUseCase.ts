import type { VerifyOtpUseCaseDto } from 'src/application/dto/auth/VerifyOtpUseCaseDto';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import type { OtpType } from 'src/domain/entities/OtpCode';
import { BadRequestError } from 'src/domain/errors/BadRequestError';
import type { IOtpRepository } from 'src/domain/repositories/IOtpRepository';
import { Email } from 'src/domain/value-objects/Email';

export class VerifyOtpUseCase {
  constructor(private readonly otpRepo: IOtpRepository) {}

  async execute(dto: VerifyOtpUseCaseDto, purpose: OtpType = 'email_verify'): Promise<void> {
    const email = new Email(dto.emailStr).toString();
    const result = await this.otpRepo.consume(email, purpose, dto.inputCode);
    if (result === 'expired') throw new BadRequestError(AUTH_MESSAGES.OTP_NOT_FOUND_OR_EXPIRED);
    if (result === 'invalid') throw new BadRequestError(AUTH_MESSAGES.OTP_INVALID);
  }
}
