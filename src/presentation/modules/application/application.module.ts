import { Module } from '@nestjs/common'
import { ApplicationController } from './application.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'
import { NotificationModule } from '../notification/notification.module'
import { ApplyToJobUseCase } from 'src/application/use-cases/application/ApplyToJobUseCase'
import { AcceptApplicationUseCase } from 'src/application/use-cases/application/AcceptApplicationUseCase'
import { RejectApplicationUseCase } from 'src/application/use-cases/application/RejectApplicationUseCase'
import { GetApplicantsUseCase } from 'src/application/use-cases/application/GetApplicantsUseCase'
import { GetMyApplicationsUseCase } from 'src/application/use-cases/application/GetMyApplicationsUseCase'
import type { IApplicationRepository } from 'src/domain/repositories/IApplicationRepository'
import type { IUserRepository } from 'src/domain/repositories/IUserRepository'
import { IJobRepository } from 'src/domain/repositories/IJobRespository'
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/CreateNotificationUseCase'

@Module({
  imports: [RepositoriesModule, NotificationModule],
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
        createNotification: CreateNotificationUseCase,
      ) =>
        new AcceptApplicationUseCase(applicationRepo, jobRepo, createNotification),
      inject: [
        'IApplicationRepository',
        'IJobRepository',
        CreateNotificationUseCase,
      ],
    },
    {
      provide: RejectApplicationUseCase,
      useFactory: (
        applicationRepo: IApplicationRepository,
        jobRepo: IJobRepository,
        createNotification: CreateNotificationUseCase,
      ) =>
        new RejectApplicationUseCase(applicationRepo, jobRepo, createNotification),
      inject: [
        'IApplicationRepository',
        'IJobRepository',
        CreateNotificationUseCase,
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
  ],
})
export class ApplicationModule {}