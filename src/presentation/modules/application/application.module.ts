import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'
import { ApplyToJobUseCase } from 'src/application/use-cases/application/ApplyToJobUseCase'
import { AcceptApplicationUseCase } from 'src/application/use-cases/application/AcceptApplicationUseCase'
import { RejectApplicationUseCase } from 'src/application/use-cases/application/RejectApplicationUseCase'
import { GetApplicantsUseCase } from 'src/application/use-cases/application/GetApplicantsUseCase'
import { GetMyApplicationsUseCase } from 'src/application/use-cases/application/GetMyApplicationsUseCase'
import { GetCompanyApplicantsUseCase } from 'src/application/use-cases/application/GetCompanyApplicantsUseCase'
import type { IApplicationRepository } from 'src/domain/repositories/IApplicationRepository'
import type { IUserRepository } from 'src/domain/repositories/IUserRepository'
import { IJobRepository } from 'src/domain/repositories/IJobRespository'

@Module({
  imports: [RepositoriesModule],
  controllers: [ApplicationController],
  providers: [
    {
      provide: ApplyToJobUseCase,
      useFactory: (
        jobRepo: IJobRepository,
        applicationRepo: IApplicationRepository,
        userRepo: IUserRepository,
      ) => new ApplyToJobUseCase(jobRepo, applicationRepo, userRepo),
      inject: ['IJobRepository', 'IApplicationRepository', 'IUserRepository'],
    },
    {
      provide: AcceptApplicationUseCase,
      useFactory: (
        applicationRepo: IApplicationRepository,
        jobRepo: IJobRepository,
      ) =>
        new AcceptApplicationUseCase(applicationRepo, jobRepo),
      inject: [
        'IApplicationRepository',
        'IJobRepository',
      ],
    },
    {
      provide: RejectApplicationUseCase,
      useFactory: (
        applicationRepo: IApplicationRepository,
        jobRepo: IJobRepository,
      ) =>
        new RejectApplicationUseCase(applicationRepo, jobRepo),
      inject: [
        'IApplicationRepository',
        'IJobRepository',
      ],
    },
    {
      provide: GetApplicantsUseCase,
      useFactory: (
        applicationRepo: IApplicationRepository,
        jobRepo: IJobRepository,
      ) => new GetApplicantsUseCase(applicationRepo, jobRepo),
      inject: ['IApplicationRepository', 'IJobRepository'],
    },
    {
      provide: GetMyApplicationsUseCase,
      useFactory: (applicationRepo: IApplicationRepository) =>
        new GetMyApplicationsUseCase(applicationRepo),
      inject: ['IApplicationRepository'],
    },
    {
      provide: GetCompanyApplicantsUseCase,
      useFactory: (applicationRepo: IApplicationRepository) =>
        new GetCompanyApplicantsUseCase(applicationRepo),
      inject: ['IApplicationRepository'],
    },
  ],
})
export class ApplicationModule {}