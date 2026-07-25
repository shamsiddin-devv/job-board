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
    if (!resume) throw new NotFoundError('CV')
 
    const result = await this.storageService.upload(fileBuffer, 'resumes')
 
    resume.attachFile(result.url)
 
    return await this.resumeRepo.update(resume.id!, resume)
  }
}