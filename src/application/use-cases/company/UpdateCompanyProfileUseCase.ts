import { UpdateCompanyDto } from "src/application/dto/company/UpdateCompanyDto";
import { COMPANY_MESSAGES } from "src/domain/constants/message"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository"
 
export class UpdateCompanyProfileUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}
 
  async execute(userId: string, dto: UpdateCompanyDto) {
    const company = await this.companyRepo.findByUserId(userId)
    if (!company) throw new NotFoundError(COMPANY_MESSAGES.COMPANY_NOT_FOUND);
 
    company.update(dto)
 
    return await this.companyRepo.update(company.id!, company)
  }
}