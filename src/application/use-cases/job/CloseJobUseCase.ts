import { JOB_MESSAGES } from "src/domain/constants/message";
import { JobStatus } from "src/domain/entities/Job";
import { BadRequestError } from "src/domain/errors/BadRequestError";
import { ForbiddenError } from "src/domain/errors/ForbiddenError";
import { NotFoundError } from "src/domain/errors/NotFoundError";
import { IJobRepository } from "src/domain/repositories/IJobRespository";


export class CloseJobUseCase {
  constructor(private readonly jobRepo: IJobRepository) {};

  async execute(jobId: string, userId: string) {
    const job = await this.jobRepo.findById(jobId);
    if(!job) throw new NotFoundError(JOB_MESSAGES.JOB_NOT_FOUND);

    if(job.userId !== userId) throw new ForbiddenError(JOB_MESSAGES.JOB_ACCESS_DENIED);
    job.closed();

    await this.jobRepo.update(jobId, job);
    return {
      message: JOB_MESSAGES.JOB_CLOSED_SUCCESS
    };
  };
};