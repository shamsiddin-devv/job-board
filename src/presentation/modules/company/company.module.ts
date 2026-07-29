import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { RepositoriesModule } from 'src/infrastructure/repositories.module';
import { CreateCompanyProfileUseCase } from 'src/application/use-cases/company/CreateCompanyProfileUseCase';
import { UpdateCompanyProfileUseCase } from 'src/application/use-cases/company/UpdateCompanyProfileUseCase';
import { VerifyCompanyUseCase } from 'src/application/use-cases/company/VerifyCompanyUseCase';
import { GetCompanyProfileUseCase } from 'src/application/use-cases/company/GetCompanyProfileUseCase';

@Module({
  imports: [RepositoriesModule],
  controllers: [CompanyController],
  providers: [
    CreateCompanyProfileUseCase,
    UpdateCompanyProfileUseCase,
    VerifyCompanyUseCase,
    GetCompanyProfileUseCase,
  ],
})
export class CompanyModule {}
