import { Module } from '@nestjs/common'
import { JobController } from './job.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'
import { PostJobUseCase } from 'src/application/use-cases/job/PostJobUseCase'
import { UpdateJobUseCase } from 'src/application/use-cases/job/UpdateJobUseCase'
import { CloseJobUseCase } from 'src/application/use-cases/job/CloseJobUseCase'
import type { IUserRepository } from 'src/domain/repositories/IUserRepository'
import type { ICompanyRepository } from 'src/domain/repositories/ICompanyRepository'
import { IJobRepository } from 'src/domain/repositories/IJobRespository'
import { SearchJobsUseCase } from 'src/application/use-cases/job/SearchJobUseCase'
import { GetByIdUseCase } from 'src/application/use-cases/job/GetJobByIdUseCase'

@Module({
  imports: [RepositoriesModule],
  controllers: [JobController],
  providers: [
    {
      provide: PostJobUseCase,
      useFactory: (
        userRepo: IUserRepository,
        companyRepo: ICompanyRepository,
        jobRepo: IJobRepository,
      ) => new PostJobUseCase(userRepo, companyRepo, jobRepo,),
      inject: ['IJobRepository', 'IUserRepository', 'ICompanyRepository'],
    },
    {
      provide: UpdateJobUseCase,
      useFactory: (jobRepo: IJobRepository) => new UpdateJobUseCase(jobRepo),
      inject: ['IJobRepository'],
    },
    {
      provide: CloseJobUseCase,
      useFactory: (jobRepo: IJobRepository) => new CloseJobUseCase(jobRepo),
      inject: ['IJobRepository'],
    },
    {
      provide: SearchJobsUseCase,
      useFactory: (jobRepo: IJobRepository) => new SearchJobsUseCase(jobRepo),
      inject: ['IJobRepository'],
    },
    {
      provide: GetByIdUseCase,
      useFactory: (jobRepo: IJobRepository) => new GetByIdUseCase(jobRepo),
      inject: ['IJobRepository'],
    },
  ],
})
export class JobModule {}