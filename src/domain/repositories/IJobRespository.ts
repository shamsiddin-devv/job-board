import { Job, PostType, JobType, WorkFormat, JobStatus } from '../entities/Job'

export type SortBy = 'newest' | 'salary_high' | 'salary_low' | 'most_viewed'

export interface JobFilters {
  city?: string
  postType?: PostType
  jobType?: JobType
  workFormat?: WorkFormat
  salaryMin?: number
  salaryMax?: number
  search?: string
  status?: JobStatus
  sortBy?: SortBy
  page?: number
  limit?: number
}

export interface JobListResult {
  data: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IJobRepository {
  findById(id: string): Promise<Job | null>
  findAll(filters: JobFilters): Promise<JobListResult>
  create(job: Job): Promise<Job>
  update(id: string, job: Job): Promise<Job>
  delete(id: string): Promise<void>
}