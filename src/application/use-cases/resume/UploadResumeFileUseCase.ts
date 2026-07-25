import { RESUME_MESSAGES } from "src/domain/constants/message"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { IResumeRepository } from "src/domain/repositories/IResumeRepository"
import { IStorageService } from "src/domain/services/IStorageService"

export class UploadResumeFileUseCase {
  constructor(
    private readonly resumeRepo: IResumeRepository,
    private readonly storageService: IStorageService,
  ) {}
 
  async execute(userId: string, fileBuffer: Buffer) {
    const resume = await this.resumeRepo.findByUserId(userId)
    if (!resume) throw new NotFoundError(RESUME_MESSAGES.RESUME_NOT_FOUND);
 
    const result = await this.storageService.upload(fileBuffer, 'resumes')
 
    resume.attachFile(result.url)
 
    return await this.resumeRepo.update(resume.id!, resume)
  }
}