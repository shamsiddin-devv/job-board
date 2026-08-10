import { CompanyFilters, ICompanyRepository } from 'src/domain/repositories/ICompanyRepository';
import { IJobRepository } from 'src/domain/repositories/IJobRespository';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

export class SearchCompaniesUseCase {
  constructor(
    private readonly companyRepo: ICompanyRepository,
    private readonly jobRepo: IJobRepository,
  ) {}

  async execute(filters: CompanyFilters) {
    const safeFilters: CompanyFilters = {
      ...filters,
      page: filters.page ?? DEFAULT_PAGE,
      limit: Math.min(filters.limit ?? DEFAULT_LIMIT, MAX_LIMIT),
    };

    const result = await this.companyRepo.findAll(safeFilters);

    const data = await Promise.all(
      result.data.map(async (company) => {
        const jobs = await this.jobRepo.findAll({
          userId: company.userId,
          postType: 'job',
          status: 'active',
          limit: 1,
        });
        return {
          id: company.id,
          userId: company.userId,
          name: company.name,
          description: company.description,
          website: company.website,
          logoUrl: company.logoUrl,
          industry: company.industry,
          size: company.size,
          city: company.city,
          isVerified: company.isVerified,
          createdAt: company.createdAt,
          openPositionsCount: jobs.total,
        };
      }),
    );

    return { ...result, data };
  }
}
