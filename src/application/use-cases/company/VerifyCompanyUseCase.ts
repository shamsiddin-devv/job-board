import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository"

export class VerifyCompanyUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}
 
  async execute(companyId: string) {
    const company = await this.companyRepo.findById(companyId)
    if (!company) throw new NotFoundError('Kompaniya')
 
    company.verify()
 
    return await this.companyRepo.update(companyId, company)
  }
}