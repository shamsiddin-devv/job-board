import { Application } from "../entities/Application"


export interface IApplicationRepository {
  findById(applicationId: string): Promise<Application | void>
  findByJobApplicant(jobId: string): Promise<Application>
  findAll(): Promise<Application[]>
  save(data: Application): Promise<Application>
  remove(applicationId: string): Promise<void>
};