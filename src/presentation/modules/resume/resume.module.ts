import { Module } from '@nestjs/common'
import { ResumeController } from './resume.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'
import type { IResumeRepository } from 'src/domain/repositories/IResumeRepository'
import type { IUserRepository } from 'src/domain/repositories/IUserRepository'
import type { IStorageService } from 'src/domain/services/IStorageService'
import { CreateResumeUseCase } from 'src/application/use-cases/resume/CreateResumeUseCase'
import { UploadResumeFileUseCase } from 'src/application/use-cases/resume/UploadResumeFileUseCase'
import { CloseResumeUseCase } from 'src/application/use-cases/resume/CloseResumeUseCase'
import { SearchResumesUseCase } from 'src/application/use-cases/resume/SearchResumesUseCase'

@Module({
  imports: [RepositoriesModule],
  controllers: [ResumeController],
  providers: [
    {
      provide: CreateResumeUseCase,
      useFactory: (resumeRepo: IResumeRepository, userRepo: IUserRepository) =>
        new CreateResumeUseCase(resumeRepo, userRepo),
      inject: ['IResumeRepository', 'IUserRepository'],
    },
    {
      provide: UploadResumeFileUseCase,
      useFactory: (
        resumeRepo: IResumeRepository,
        storageService: IStorageService,
      ) => new UploadResumeFileUseCase(resumeRepo, storageService),
      inject: ['IResumeRepository', 'IStorageService'],
    },
    {
      provide: CloseResumeUseCase,
      useFactory: (resumeRepo: IResumeRepository) =>
        new CloseResumeUseCase(resumeRepo),
      inject: ['IResumeRepository'],
    },
    {
      provide: SearchResumesUseCase,
      useFactory: (resumeRepo: IResumeRepository) =>
        new SearchResumesUseCase(resumeRepo),
      inject: ['IResumeRepository'],
    },
  ],
})
export class ResumeModule {}