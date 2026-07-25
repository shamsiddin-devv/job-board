import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository"

export interface UpdateCompanyDto {
  name?: string
  description?: string
  website?: string
  logoUrl?: string
  industry?: string
  size?: string
  city?: string
}
 
export class UpdateCompanyProfileUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}
 
  async execute(userId: string, dto: UpdateCompanyDto) {
    const company = await this.companyRepo.findByUserId(userId)
    if (!company) throw new NotFoundError('Kompaniya profili')
 
    company.update(dto)
 
    return await this.companyRepo.update(company.id!, company)
  }
}