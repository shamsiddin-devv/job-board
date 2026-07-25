import { IResumeRepository, ResumeFilters } from "src/domain/repositories/IResumeRepository";

export class SearchResumesUseCase {
  constructor(private readonly resumeRepo: IResumeRepository) {}
 
  async execute(filters: ResumeFilters) {
    const safeFilters = {
      ...filters,
      page: filters.page ?? 1,
      limit: Math.min(filters.limit ?? 20, 100),
    }
    return await this.resumeRepo.findAll(safeFilters)
  }
}