import { SavedJob } from '../entities/SavedJob';

export interface ISavedJobRepository {
  findById(userId: string): Promise<SavedJob>;
  findByUserId(userId: string): Promise<SavedJob>
  findByUserAndJob()
  findAll(): Promise<SavedJob[]>;
  save(data: SavedJob): Promise<SavedJob>;
  remove(userId: string): Promise<void>;
}
