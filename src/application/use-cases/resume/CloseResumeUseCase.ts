import { NotFoundError } from "src/domain/errors/NotFoundError"
import { IResumeRepository } from "src/domain/repositories/IResumeRepository"

export class CloseResumeUseCase {
  constructor(private readonly resumeRepo: IResumeRepository) {}
 
  async execute(userId: string) {
    const resume = await this.resumeRepo.findByUserId(userId)
    if (!resume) throw new NotFoundError('CV')
 
    resume.close()
 
    return await this.resumeRepo.update(resume.id!, resume)
  }
}