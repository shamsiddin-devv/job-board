import { JOB_MESSAGES } from "src/domain/constants/message"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { UnauthorizedError } from "src/domain/errors/UnauthorizedError"
import { IApplicationRepository } from "src/domain/repositories/IApplicationRepository"
import { IJobRepository } from "src/domain/repositories/IJobRespository"

export class AcceptApplicationUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly jobRepo: IJobRepository,
  ) {}
 
  async execute(applicationId: string, requesterId: string) {
    const application = await this.applicationRepo.findById(applicationId)
    if (!application) throw new NotFoundError('Ariza')
 
    // Faqat shu vakansiya egasi qabul qila oladi
    const job = await this.jobRepo.findById(application.jobId)
    if (!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND)
    if (job.userId !== requesterId)
      throw new UnauthorizedError('Bu arizani boshqarish huquqingiz yo\'q')
 
    application.accept()
 
    return await this.applicationRepo.update(applicationId, application)
  }
}