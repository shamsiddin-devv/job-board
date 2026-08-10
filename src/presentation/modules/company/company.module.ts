import { Module } from '@nestjs/common'
import { CompanyController } from './company.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'
import type { ICompanyRepository } from 'src/domain/repositories/ICompanyRepository'
import type { IUserRepository } from 'src/domain/repositories/IUserRepository'
import type { IJobRepository } from 'src/domain/repositories/IJobRespository'
import type { IStorageService } from 'src/domain/services/IStorageService'
import { CreateCompanyProfileUseCase } from 'src/application/use-cases/company/CreateCompanyProfileUseCase'
import { UpdateCompanyProfileUseCase } from 'src/application/use-cases/company/UpdateCompanyProfileUseCase'
import { VerifyCompanyUseCase } from 'src/application/use-cases/company/VerifyCompanyUseCase'
import { GetCompanyProfileUseCase } from 'src/application/use-cases/company/GetCompanyProfileUseCase'
import { SearchCompaniesUseCase } from 'src/application/use-cases/company/SearchCompaniesUseCase'
import { GetMyCompanyUseCase } from 'src/application/use-cases/company/GetMyCompanyUseCase'
import { UploadCompanyLogoUseCase } from 'src/application/use-cases/company/UploadCompanyLogoUseCase'

@Module({
  imports: [RepositoriesModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: CreateCompanyProfileUseCase,
      useFactory: (companyRepo: ICompanyRepository, userRepo: IUserRepository) =>
        new CreateCompanyProfileUseCase(companyRepo, userRepo),
      inject: ['ICompanyRepository', 'IUserRepository'],
    },
    {
      provide: UpdateCompanyProfileUseCase,
      useFactory: (companyRepo: ICompanyRepository) =>
        new UpdateCompanyProfileUseCase(companyRepo),
      inject: ['ICompanyRepository'],
    },
    {
      provide: VerifyCompanyUseCase,
      useFactory: (companyRepo: ICompanyRepository) =>
        new VerifyCompanyUseCase(companyRepo),
      inject: ['ICompanyRepository'],
    },
    {
      provide: GetCompanyProfileUseCase,
      useFactory: (companyRepo: ICompanyRepository) =>
        new GetCompanyProfileUseCase(companyRepo),
      inject: ['ICompanyRepository'],
    },
    {
      provide: SearchCompaniesUseCase,
      useFactory: (companyRepo: ICompanyRepository, jobRepo: IJobRepository) =>
        new SearchCompaniesUseCase(companyRepo, jobRepo),
      inject: ['ICompanyRepository', 'IJobRepository'],
    },
    {
      provide: GetMyCompanyUseCase,
      useFactory: (companyRepo: ICompanyRepository) =>
        new GetMyCompanyUseCase(companyRepo),
      inject: ['ICompanyRepository'],
    },
    {
      provide: UploadCompanyLogoUseCase,
      useFactory: (
        companyRepo: ICompanyRepository,
        storageService: IStorageService,
      ) => new UploadCompanyLogoUseCase(companyRepo, storageService),
      inject: ['ICompanyRepository', 'IStorageService'],
    },
  ],
})
export class CompanyModule {}