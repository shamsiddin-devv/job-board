import { Module } from '@nestjs/common'
import { SavedJobController } from './saved-job.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'
import { ISavedJobRepository } from 'src/domain/repositories/ISavedJobRepository'
import { SaveJobUseCase } from 'src/application/use-cases/saved-job/SaveJobUseCase'
import { IJobRepository } from 'src/domain/repositories/IJobRespository'
import { UnsaveJobUseCase } from 'src/application/use-cases/saved-job/UnsaveJobUseCase'
import { GetSavedJobsUseCase } from 'src/application/use-cases/saved-job/GetSavedJobsUseCase'

@Module({
  imports: [RepositoriesModule],
  controllers: [SavedJobController],
  providers: [
    {
      provide: SaveJobUseCase,
      useFactory: (
        savedJobRepo: ISavedJobRepository,
        jobRepo: IJobRepository,
      ) => new SaveJobUseCase(savedJobRepo, jobRepo),
      inject: ['ISavedJobRepository', 'IJobRepository'],
    },
    {
      provide: UnsaveJobUseCase,
      useFactory: (savedJobRepo: ISavedJobRepository) =>
        new UnsaveJobUseCase(savedJobRepo),
      inject: ['ISavedJobRepository'],
    },
    {
      provide: GetSavedJobsUseCase,
      useFactory: (savedJobRepo: ISavedJobRepository) =>
        new GetSavedJobsUseCase(savedJobRepo),
      inject: ['ISavedJobRepository'],
    },
  ],
})
export class SavedJobModule {}