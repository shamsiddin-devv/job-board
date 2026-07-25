import { SavedJob } from "src/domain/entities/SavedJob"
import { ConflictError } from "src/domain/errors/ConflictError"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { IJobRepository } from "src/domain/repositories/IJobRespository"
import { ISavedJobRepository } from "src/domain/repositories/ISavedJobRepository"

export class SaveJobUseCase {
  constructor(
    private readonly savedJobRepo: ISavedJobRepository,
    private readonly jobRepo: IJobRepository,
  ) {}
 
  async execute(userId: string, jobId: string) {
    const job = await this.jobRepo.findById(jobId)
    if (!job) throw new NotFoundError('Vakansiya')
 
    const existing = await this.savedJobRepo.findByUserAndJob(userId, jobId)
    if (existing) throw new ConflictError('Allaqachon saqlangan')
 
    const savedJob = new SavedJob({ userId, jobId })
    return await this.savedJobRepo.create(savedJob)
  }
}