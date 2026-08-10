import { JOB_MESSAGES } from 'src/domain/constants/message';
import { ForbiddenError } from 'src/domain/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { IJobRepository } from 'src/domain/repositories/IJobRespository';

export class DeleteJobUseCase {
  constructor(private readonly jobRepo: IJobRepository) {}

  async execute(jobId: string, userId: string) {
    const job = await this.jobRepo.findById(jobId);
    if (!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND);

    if (job.userId !== userId) {
      throw new ForbiddenError(JOB_MESSAGES.JOB_ACCESS_DENIED);
    }

    await this.jobRepo.delete(jobId);
    return { message: JOB_MESSAGES.JOB_DELETED };
  }
}
