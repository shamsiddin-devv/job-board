import { UpdateJobDto } from 'src/application/dto/job/UpdateJobDto';
import { AUTH_MESSAGES, JOB_MESSAGES } from 'src/domain/constants/message';
import { ForbiddenError } from 'src/domain/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { IJobRepository } from 'src/domain/repositories/IJobRespository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';

export class UpdateJobUseCase {
  constructor(
    private readonly jobRepo: IJobRepository,
  ) {};

  async execute(jobId: string, dto: UpdateJobDto, userId: string) {
    const job = await this.jobRepo.findById(jobId);
    if(!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND);
    
    if(job.userId !== userId) throw new ForbiddenError(JOB_MESSAGES.JOB_ACCESS_DENIED);

    job.update(dto);
    return this.jobRepo.update(jobId, job);
  };
};
