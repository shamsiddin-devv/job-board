import { IApplicationRepository } from 'src/domain/repositories/IApplicationRepository';

export class GetCompanyApplicantsUseCase {
  constructor(private readonly applicationRepo: IApplicationRepository) {}

  async execute(ownerUserId: string, page?: number, limit?: number) {
    return await this.applicationRepo.findEnrichedByOwner(ownerUserId, page, limit);
  }
}
