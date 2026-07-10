import { Resume } from "../entities/Resume";

export interface IResumeRepository {
  findById(resumeId: string): Promise<Resume | null>
  findByUserId(userId: string): Promise<Resume | null>
  findAll(): Promise<Resume[]>
  save(data: Resume): Promise<Resume>
  remove(resumeId: string): Promise<void>
};