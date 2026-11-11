import type { Notification } from '../entities/Notification'
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

export interface EnrichedApplication {
  id: string
  jobId: string
  applicantId: string
  coverLetter?: string
  resumeUrl?: string
  status: IApplicationStatus
  appliedAt: Date
  job: { id: string; title: string; postType: string } | null
  applicant: {
    id: string
    fullName: string
    email: string
    avatarUrl?: string
  } | null
}

export interface EnrichedApplicationListResult {
  data: EnrichedApplication[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IApplicationRepository {
  findById(id: string): Promise<Application | null>
  findByJobAndApplicant(jobId: string, applicantId: string): Promise<Application | null>
  findAll(filters: ApplicationFilters): Promise<ApplicationListResult>
  findEnrichedByJobId(jobId: string, page?: number, limit?: number): Promise<EnrichedApplicationListResult>
  findEnrichedByApplicant(applicantId: string, page?: number, limit?: number): Promise<EnrichedApplicationListResult>
  findEnrichedByOwner(ownerUserId: string, page?: number, limit?: number): Promise<EnrichedApplicationListResult>
  create(application: Application): Promise<Application>
  decide(id: string, application: Application, notification: Notification): Promise<Application>
  delete(id: string): Promise<void>
}