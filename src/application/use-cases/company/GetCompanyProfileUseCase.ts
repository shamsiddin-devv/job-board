import { COMPANY_MESSAGES } from "src/domain/constants/message"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository"

export class GetCompanyProfileUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}
 
  async execute(companyId: string) {
    const company = await this.companyRepo.findById(companyId)
    if (!company) throw new NotFoundError(COMPANY_MESSAGES.COMPANY_NOT_FOUND);
    return company
  }
}