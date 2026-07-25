import { APPLICATION_MESSAGES, JOB_MESSAGES } from "src/domain/constants/message"
import { ForbiddenError } from "src/domain/errors/ForbiddenError"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { UnauthorizedError } from "src/domain/errors/UnauthorizedError"
import { IApplicationRepository } from "src/domain/repositories/IApplicationRepository"
import { IJobRepository } from "src/domain/repositories/IJobRespository"

export class RejectApplicationUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly jobRepo: IJobRepository,
  ) {}
 
  async execute(applicationId: string, requesterId: string) {
    const application = await this.applicationRepo.findById(applicationId)
    if (!application) throw new NotFoundError(APPLICATION_MESSAGES.APPLICATION_NOT_FOUND);
 
    const job = await this.jobRepo.findById(application.jobId)
    if (!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND)
    if (job.userId !== requesterId)
      throw new ForbiddenError(APPLICATION_MESSAGES.NOT_PERMISSION);
 
    application.reject()
 
    return await this.applicationRepo.update(applicationId, application)
  }
}