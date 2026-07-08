import { Resume } from "../entities/Resume";

export interface IResumeRepository {
  findById(resumeId: string): Promise<Resume | void>
  findByUserId(userId: string): Promise<Resume>
  findAll(): Promise<Resume[]>
  save(data: Resume): Promise<Resume>
  remove(resumeId: string): Promise<void>
};