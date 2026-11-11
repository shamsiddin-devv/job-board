import { JOB_MESSAGES } from 'src/domain/constants/message';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { IJobRepository } from 'src/domain/repositories/IJobRespository';

export class GetByIdUseCase {
  constructor(
    private readonly jobRepo: IJobRepository,
  ) {}

  async execute(jobId: string) {
    const job = await this.jobRepo.incrementPublicViews(jobId);
    if (!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND);
    
    return {
      id: job.id,
      userId: job.userId,
      title: job.title,
      description: job.description,
      postType: job.postType,
      jobType: job.jobType,
      workFormat: job.workFormat,
      city: job.city,
      salaryRange: job.salaryRange
        ? {
            min: job.salaryRange.min,
            max: job.salaryRange.max,
            currency: job.salaryRange.currency,
          }
        : undefined,
      status: job.status,
      viewsCount: job.viewsCount,
      createdAt: job.createdAt,
    };
  }
}
