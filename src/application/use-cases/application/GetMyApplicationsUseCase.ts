import { IApplicationRepository } from "src/domain/repositories/IApplicationRepository";

export class GetMyApplicationsUseCase {
  constructor(private readonly applicationRepo: IApplicationRepository) {}
 
  async execute(applicantId: string, page?: number, limit?: number) {
    return await this.applicationRepo.findAll({ applicantId, page, limit })
  };
};