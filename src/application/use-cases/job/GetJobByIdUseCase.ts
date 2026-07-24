import { JOB_MESSAGES } from 'src/domain/constants/message';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { IJobRepository } from 'src/domain/repositories/IJobRespository';

export class GetByIdUseCase {
  constructor(private readonly jobRepo: IJobRepository) {}

  async execute(jobId: string) {
    const job = await this.jobRepo.findById(jobId);
    if (!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND);
    job.incrementViews();

    return {
      id: job.id,
      userId: job.userId,
      title: job.title,
      description: job.description,
      postType: job.postType,
      jobType: job.jobType,
      workFormat: job.workFormat,
      viewsCount: job.viewsCount,
      createdAt: job.createdAt
    };
  }
}
