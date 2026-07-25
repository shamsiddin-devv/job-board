import { Application, IApplicationStatus } from '../entities/Application'

export interface ApplicationFilters {
  jobId?: string
  applicantId?: string
  status?: IApplicationStatus
  page?: number
  limit?: number
}

export interface ApplicationListResult {
  data: Application[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IApplicationRepository {
  findById(id: string): Promise<Application | null>
  findByJobAndApplicant(jobId: string, applicantId: string): Promise<Application | null>
  findAll(filters: ApplicationFilters): Promise<ApplicationListResult>
  create(application: Application): Promise<Application>
  update(id: string, application: Application): Promise<Application>
  delete(id: string): Promise<void>
}