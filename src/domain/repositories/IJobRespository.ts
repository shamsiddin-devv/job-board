import { Job } from '@prisma/client';

export interface IJobRepository {
  findById(uuid: string): Promise<Job | void>;
  findAllByOwnerId(uuid: string): Promise<Job[]>;
  findAll(): Promise<Job[]>;
  save(job: Job): Promise<Job>;
  delete(uuid: string): Promise<void>;
}
