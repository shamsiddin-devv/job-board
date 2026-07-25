import { ISavedJobRepository } from "src/domain/repositories/ISavedJobRepository";

export class GetSavedJobsUseCase {
  constructor(private readonly savedJobRepo: ISavedJobRepository) {}
 
  async execute(userId: string, page?: number, limit?: number) {
    return await this.savedJobRepo.findByUserId(userId, page, limit)
  }
}