import { SAVED_JOB_MESSAGES } from "src/domain/constants/message"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ISavedJobRepository } from "src/domain/repositories/ISavedJobRepository"

export class UnsaveJobUseCase {
  constructor(private readonly savedJobRepo: ISavedJobRepository) {}
 
  async execute(userId: string, jobId: string) {
    const existing = await this.savedJobRepo.findByUserAndJob(userId, jobId)
    if (!existing) throw new NotFoundError(SAVED_JOB_MESSAGES.SAVED_VACANCY_NOT_FOUND)
 
    await this.savedJobRepo.delete(userId, jobId)
    return { message: SAVED_JOB_MESSAGES.REMOVED_SUCCESSFULLY }
  }
}