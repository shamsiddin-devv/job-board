import { RegisterDto } from 'src/application/dto/auth/RegisterDto';
import { User } from 'src/domain/entities/User';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { IHashRepository } from 'src/domain/services/IHashService';
import { Email } from 'src/domain/value-objects/Email';
import { SendOtpUseCase } from './SendOtpUseCase';

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashService: IHashRepository,
    private readonly sendOtpUseCase: SendOtpUseCase
  ) {}

  async execute(dto: RegisterDto) {
    const email = new Email(dto.email);

    const exist = await this.userRepo.findByEmail(email.toString());
    if(exist) throw new ConflictError('User already exist.');

    const passwordHash = await this.hashService.hash(dto.password);

    const user = new User({
      email,
      name: dto.name,
      role: dto.role
    });

    await this.userRepo.create(user, passwordHash);
    await this.sendOtpUseCase.execute(dto.email);

    return {success: true, message: `Verification code has been sent to your email.`}
  };
};
