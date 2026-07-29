import { Module } from '@nestjs/common';
import { SavedJobController } from './saved-job.controller';
import { RepositoriesModule } from 'src/infrastructure/repositories.module';
import { SaveJobUseCase } from 'src/application/use-cases/saved-job/SaveJobUseCase';
import { UnsaveJobUseCase } from 'src/application/use-cases/saved-job/UnsaveJobUseCase';
import { GetSavedJobsUseCase } from 'src/application/use-cases/saved-job/GetSavedJobsUseCase';

@Module({
  imports: [RepositoriesModule],
  controllers: [SavedJobController],
  providers: [SaveJobUseCase, UnsaveJobUseCase, GetSavedJobsUseCase],
})
export class SavedJobModule {}
