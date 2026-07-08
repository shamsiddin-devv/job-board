import { Job } from '@prisma/client';

export interface IJobRepository {
  findById(jobId: string): Promise<Job | void>;
  findAllByUserId(userId: string): Promise<Job[]>;
  findAll(): Promise<Job[]>;
  save(data: Job): Promise<Job>;
  remove(jobId: string): Promise<void>;
}
