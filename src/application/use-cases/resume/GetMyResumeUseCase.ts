import { IResumeRepository } from 'src/domain/repositories/IResumeRepository';

export class GetMyResumeUseCase {
  constructor(private readonly resumeRepo: IResumeRepository) {}

  async execute(userId: string) {
    return await this.resumeRepo.findByUserId(userId);
  }
}
