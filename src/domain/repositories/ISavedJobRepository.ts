import { SavedJob } from '../entities/SavedJob';

export interface ISavedJobRepository {
  findById(userId: string): Promise<SavedJob| null>;
  findByUserId(userId: string): Promise<SavedJob[]>
  findByUserAndJob(userId: string, jobId: string): Promise<SavedJob | null>
  findAll(): Promise<SavedJob[]>;
  save(data: SavedJob): Promise<SavedJob>;
  remove(userId: string): Promise<void>;
}
