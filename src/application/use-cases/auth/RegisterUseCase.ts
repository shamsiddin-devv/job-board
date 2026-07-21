import { RegisterDto } from 'src/application/dto/auth/RegisterDto';
import { User } from 'src/domain/entities/User';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { IHashRepository } from 'src/domain/services/IHashService';
import { Email } from 'src/domain/value-objects/Email';
import { SendOtpUseCase } from './SendOtpUseCase';
import { AUTH_MESSAGES } from 'src/domain/constants/message';

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashRepository,
    private readonly sendOtpUseCase: SendOtpUseCase
  ) {}

  async execute(dto: RegisterDto) {
    const email = new Email(dto.email);

    const exist = await this.userRepo.findByEmail(email.toString());
    if(exist) throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);

    const passwordHash = await this.hashService.hash(dto.password);

    const user = new User({
      email,
      name: dto.name,
      role: dto.role
    });

    await this.userRepo.create(user, passwordHash);
    await this.sendOtpUseCase.execute(dto.email);

    return {success: true, message: AUTH_MESSAGES.OTP_SENT}
  };
};
