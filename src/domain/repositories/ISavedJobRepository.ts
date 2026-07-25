import { SavedJob } from "../entities/SavedJob"

export interface SavedJobListResult {
  data: SavedJob[]
  total: number
  page: number
  limit: number
  totalPages: number
}
 
export interface ISavedJobRepository {
  findByUserAndJob(userId: string, jobId: string): Promise<SavedJob | null>
  findByUserId(userId: string, page?: number, limit?: number): Promise<SavedJobListResult>
  create(savedJob: SavedJob): Promise<SavedJob>
  delete(userId: string, jobId: string): Promise<void>
}