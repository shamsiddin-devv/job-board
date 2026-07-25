import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ISavedJobRepository } from "src/domain/repositories/ISavedJobRepository"

export class UnsaveJobUseCase {
  constructor(private readonly savedJobRepo: ISavedJobRepository) {}
 
  async execute(userId: string, jobId: string) {
    const existing = await this.savedJobRepo.findByUserAndJob(userId, jobId)
    if (!existing) throw new NotFoundError('Saqlangan vakansiya')
 
    await this.savedJobRepo.delete(userId, jobId)
    return { message: 'Saqlashdan olib tashlandi' }
  }
}