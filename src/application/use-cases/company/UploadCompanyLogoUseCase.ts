import { COMPANY_MESSAGES } from 'src/domain/constants/message';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { ICompanyRepository } from 'src/domain/repositories/ICompanyRepository';
import { IStorageService } from 'src/domain/services/IStorageService';

export class UploadCompanyLogoUseCase {
  constructor(
    private readonly companyRepo: ICompanyRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(userId: string, file: Buffer) {
    const company = await this.companyRepo.findByUserId(userId);
    if (!company) throw new NotFoundError(COMPANY_MESSAGES.COMPANY_NOT_FOUND);

    const uploaded = await this.storageService.upload(file, 'logos');
    company.update({ logoUrl: uploaded.url });

    return await this.companyRepo.update(company.id!, company);
  }
}
