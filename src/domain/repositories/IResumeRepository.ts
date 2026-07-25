import { Resume } from '../entities/Resume'

export interface ResumeFilters {
  city?: string
  salaryMin?: number
  search?: string
  page?: number
  limit?: number
}

export interface ResumeListResult {
  data: Resume[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IResumeRepository {
  findById(id: string): Promise<Resume | null>
  findByUserId(userId: string): Promise<Resume | null>
  findAll(filters: ResumeFilters): Promise<ResumeListResult>
  create(resume: Resume): Promise<Resume>
  update(id: string, resume: Resume): Promise<Resume>
  delete(id: string): Promise<void>
}