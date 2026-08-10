import { RegisterDto } from 'src/application/dto/auth/RegisterDto';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { Email } from 'src/domain/value-objects/Email';
import { SendOtpUseCase } from './SendOtpUseCase';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { ICacheRedisService } from 'src/domain/services/ICacheRedisService';
import { IHashService } from 'src/domain/services/IHashService';
import { User } from 'src/domain/entities/User';

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashService,
    private readonly sendOtpUseCase: SendOtpUseCase,
  ) {}

  async execute(dto: RegisterDto) {
    const verifyEmail = new Email(dto.email);

    const exist = await this.userRepo.findByEmail(verifyEmail.toString());
    if(exist) throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);

    const hashPassword = await this.hashService.hash(dto.password);

    const user = new User({
      email: verifyEmail,
      fullName: dto.fullName,
      phone: dto.phone,
      role: dto.role,
      avatarUrl: dto.avatarUrl,
    });

    await this.userRepo.create(user, hashPassword);
    await this.sendOtpUseCase.execute(dto.email);

    return {success: true, message: AUTH_MESSAGES.OTP_SENT}
  };
};
