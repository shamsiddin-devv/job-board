import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { VerifyOtpUseCase } from './VerifyOtpUseCase';
import { Email } from 'src/domain/value-objects/Email';
import { AUTH_MESSAGES } from 'src/domain/constants/message';
import { VerifyOtpUseCaseDto } from 'src/application/dto/auth/VerifyOtpUseCaseDto';
import { ICacheRedisService } from 'src/domain/services/ICacheRedisService';
import { User } from 'src/domain/entities/User';

export class ConfirmRegistrationUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly verifyOtp: VerifyOtpUseCase,
    private readonly redisService: ICacheRedisService
  ) {}

  async execute(dto: VerifyOtpUseCaseDto) {
    const verifyEmail = new Email(dto.emailStr);

    const cacheUser = await this.redisService.get(verifyEmail.toString());
    console.log(cacheUser)
    // const user = new User(cacheUser);

    // await this.verifyOtp.execute(dto);
    // user.markAsVerified();
    // await this.userRepo.update(user.id!, user);

    // return {
    //   message: AUTH_MESSAGES.REGISTER_SUCCESS,
    //   user: {
    //     id: user.id,
    //     email: user.email.toString(),
    //     fullName: user.fullName,
    //     role: user.role,
    //   },
    // };
  };
};
