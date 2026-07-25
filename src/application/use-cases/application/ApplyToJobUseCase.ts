import { APPLICATION_MESSAGES, JOB_MESSAGES } from "src/domain/constants/message"
import { Application } from "src/domain/entities/Application"
import { ConflictError } from "src/domain/errors/ConflictError"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { UnauthorizedError } from "src/domain/errors/UnauthorizedError"
import { IApplicationRepository } from "src/domain/repositories/IApplicationRepository"
import { IJobRepository } from "src/domain/repositories/IJobRespository"
import { IUserRepository } from "src/domain/repositories/IUserRepository"

export interface ApplyToJobDto {
  coverLetter?: string
  resumeUrl?: string
}
 
export class ApplyToJobUseCase {
  constructor(
    private readonly jobRepo: IJobRepository,
    private readonly applicationRepo: IApplicationRepository,
    private readonly userRepo: IUserRepository,
  ) {}
 
  async execute(jobId: string, applicantId: string, dto: ApplyToJobDto) {
    const applicant = await this.userRepo.findById(applicantId)
    if (!applicant) throw new NotFoundError('Foydalanuvchi')
    if (!applicant.isWorker())
      throw new UnauthorizedError('Faqat workerlar ariza topshira oladi')
 
    const job = await this.jobRepo.findById(jobId)
    if (!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND)
 
    if (job.status !== 'active')
      throw new ConflictError(JOB_MESSAGES.JOB_ALREADY_CLOSED)
 
    if (job.userId === applicantId)
      throw new UnauthorizedError('O\'z e\'loningizga ariza bera olmaysiz')
 
    const existing = await this.applicationRepo.findByJobAndApplicant(
      jobId,
      applicantId,
    )
    if (existing) throw new ConflictError(APPLICATION_MESSAGES.ALREADY_APPLIED)
 
    const application = new Application({
      jobId,
      applicantId,
      coverLetter: dto.coverLetter,
      resumeUrl: dto.resumeUrl,
    })
 
    return await this.applicationRepo.create(application)
  }
}