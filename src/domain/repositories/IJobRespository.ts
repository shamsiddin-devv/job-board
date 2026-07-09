import { Job } from "../entities/Job";

export interface IJobRepository {
  findById(jobId: string): Promise<Job | null>;
  findAllByUserId(userId: string): Promise<Job[] | null>;
  findAll(): Promise<Job[]>;
  save(data: Job): Promise<Job>;
  remove(jobId: string): Promise<void>;
}
