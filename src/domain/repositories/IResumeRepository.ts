import { Resume } from "../entities/Resume";

export interface IResumeRepository {
  findById(uuid: string): Promise<Resume | void>
  findByUserId(uuid: string): Promise<Resume>
  findAll(): Promise<Resume[]>
  save(resume: Resume): Promise<Resume>
  delete(uuid: string): Promise<void>
};