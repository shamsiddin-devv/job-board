import { RESUME_MESSAGES } from "src/domain/constants/message";
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { IResumeRepository } from "src/domain/repositories/IResumeRepository"

export class CloseResumeUseCase {
  constructor(private readonly resumeRepo: IResumeRepository) {}
 
  async execute(userId: string) {
    const resume = await this.resumeRepo.findByUserId(userId)
    if (!resume) throw new NotFoundError(RESUME_MESSAGES.RESUME_NOT_FOUND);
 
    resume.close()
 
    return await this.resumeRepo.update(resume.id!, resume)
  }
}