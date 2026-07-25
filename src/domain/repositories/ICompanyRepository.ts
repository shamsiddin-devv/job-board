import { Company } from '../entities/Company'

export interface CompanyFilters {
  isVerified?: boolean
  industry?: string
  city?: string
  search?: string
  page?: number
  limit?: number
}

export interface CompanyListResult {
  data: Company[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>
  findByUserId(userId: string): Promise<Company | null>
  findAll(filters: CompanyFilters): Promise<CompanyListResult>
  create(company: Company): Promise<Company>
  update(id: string, company: Company): Promise<Company>
  delete(id: string): Promise<void>
}