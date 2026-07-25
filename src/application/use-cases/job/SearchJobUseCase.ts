import { IJobRepository, JobFilters } from "src/domain/repositories/IJobRespository"

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 20
const DEFAULT_PAGE = 1

export class SearchJobsUseCase {
  constructor(private readonly jobRepo: IJobRepository) {}

  async execute(filters: JobFilters) {
    const safeFilters: JobFilters = {
      ...filters,
      page: filters.page ?? DEFAULT_PAGE,
      limit: Math.min(filters.limit ?? DEFAULT_LIMIT, MAX_LIMIT),
    }

    return await this.jobRepo.findAll(safeFilters)
  }
}