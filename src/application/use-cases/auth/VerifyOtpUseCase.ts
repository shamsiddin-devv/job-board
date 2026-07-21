import { BadRequestError } from 'src/domain/errors/BadRequestError';
import { IOtpRepository } from 'src/domain/repositories/IOtpRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { Email } from 'src/domain/value-objects/Email';

export class VerifyOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
  ) {}

  async execute(emailStr: string, inputCode: string): Promise<Boolean> {
    const email = new Email(emailStr);

    const savedCode = await this.otpRepo.find(email.toString());
    if(!savedCode) {
      throw new BadRequestError('OTP not found or expired.');
    };

    if(savedCode !== inputCode) {
      throw new BadRequestError('Invalid OTP');
    };

    await this.otpRepo.remove(email.toString());

    return true;
  };
}
