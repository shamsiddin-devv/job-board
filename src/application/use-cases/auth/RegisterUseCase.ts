import { RegisterDto } from 'src/application/dto/auth/RegisterDto';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { Email } from 'src/domain/value-objects/Email';
import { SendOtpUseCase } from './SendOtpUseCase';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { ICacheRedisService } from 'src/domain/services/ICacheRedisService';

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly redisService: ICacheRedisService,
    private readonly sendOtpUseCase: SendOtpUseCase,
  ) {}

  async execute(dto: RegisterDto) {
    const email = new Email(dto.email);

    const exist = await this.userRepo.findByEmail(email.toString());
    if(exist) throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);

    await this.redisService.set(`${email.toString()}`, dto, 300);
    await this.sendOtpUseCase.execute(dto.email);

    return {success: true, message: AUTH_MESSAGES.OTP_SENT}
  };
};
