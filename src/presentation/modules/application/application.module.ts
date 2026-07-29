import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { RepositoriesModule } from 'src/infrastructure/repositories.module';
import { ApplyToJobUseCase } from 'src/application/use-cases/application/ApplyToJobUseCase';
import { AcceptApplicationUseCase } from 'src/application/use-cases/application/AcceptApplicationUseCase';
import { RejectApplicationUseCase } from 'src/application/use-cases/application/RejectApplicationUseCase';
import { GetApplicantsUseCase } from 'src/application/use-cases/application/GetApplicantsUseCase';
import { GetMyApplicationsUseCase } from 'src/application/use-cases/application/GetMyApplicationsUseCase';

@Module({
  imports: [RepositoriesModule],
  controllers: [ApplicationController],
  providers: [
    ApplyToJobUseCase,
    AcceptApplicationUseCase,
    RejectApplicationUseCase,
    GetApplicantsUseCase,
    GetMyApplicationsUseCase,
  ],
})
export class ApplicationModule {}
