import { COMPANY_MESSAGES } from 'src/domain/constants/message';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { ICompanyRepository } from 'src/domain/repositories/ICompanyRepository';

export class GetMyCompanyUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}

  async execute(userId: string) {
    const company = await this.companyRepo.findByUserId(userId);
    if (!company) throw new NotFoundError(COMPANY_MESSAGES.COMPANY_NOT_FOUND);
    return company;
  }
}
