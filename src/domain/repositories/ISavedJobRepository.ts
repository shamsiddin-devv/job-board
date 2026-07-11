import { SavedJob } from '../entities/SavedJob';

export interface ISavedJobRepository {
  findById(savedId: string): Promise<SavedJob| null>;
  findByUserId(userId: string): Promise<SavedJob[]>
  findByUserAndJob(userId: string, jobId: string): Promise<SavedJob | null>
  findAll(): Promise<SavedJob[]>;
  create(data: SavedJob): Promise<SavedJob>;
  update(savedId: string, data: SavedJob): Promise<SavedJob>
  remove(savedId: string): Promise<void>;
}
