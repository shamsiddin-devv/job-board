import { Application } from "../entities/Application"

export interface IApplicationRepository {
  findById(applicationId: string): Promise<Application | null>
  findByJobApplicant(jobId: string, applicantId: string): Promise<Application | null>
  findAll(): Promise<Application[]>
  create(data: Application): Promise<Application>
  update(applicationId: string, data: Application): Promise<Application>
  remove(applicationId: string): Promise<void>
};