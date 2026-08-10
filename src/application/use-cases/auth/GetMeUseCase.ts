import { USER_MESSAGES } from 'src/domain/constants/message';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';

export class GetMeUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);

    return {
      id: user.id,
      email: user.email.toString(),
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
