import { Application } from "../entities/Application"


export interface IApplicationRepository {
  findById(uuid: string): Promise<Application | void>
  findByJobApplicant(uuid: string): Promise<Application>
  findAll(): Promise<Application[]>
  save(application: Application): Promise<Application>
  delete(uuid: string): Promise<void>
};