import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository"

export class GetCompanyProfileUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}
 
  async execute(companyId: string) {
    const company = await this.companyRepo.findById(companyId)
    if (!company) throw new NotFoundError('Kompaniya')
    return company
  }
}