import { JOB_MESSAGES } from "src/domain/constants/message"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { UnauthorizedError } from "src/domain/errors/UnauthorizedError"
import { IApplicationRepository } from "src/domain/repositories/IApplicationRepository"
import { IJobRepository } from "src/domain/repositories/IJobRespository"

export class GetApplicantsUseCase {
  constructor(
    private readonly applicationRepo: IApplicationRepository,
    private readonly jobRepo: IJobRepository,
  ) {}
 
  async execute(jobId: string, requesterId: string, page?: number, limit?: number) {
    const job = await this.jobRepo.findById(jobId)
    if (!job) throw new NotFoundError(JOB_MESSAGES.USER_NOT_FOUND)
    if (job.userId !== requesterId)
      throw new UnauthorizedError('Bu vakansiya arizalarini ko\'ra olmaysiz')
 
    return await this.applicationRepo.findAll({ jobId, page, limit })
  }
}