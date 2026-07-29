import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { RepositoriesModule } from 'src/infrastructure/repositories.module';
import { PostJobUseCase } from 'src/application/use-cases/job/PostJobUseCase';
import { UpdateJobUseCase } from 'src/application/use-cases/job/UpdateJobUseCase';
import { CloseJobUseCase } from 'src/application/use-cases/job/CloseJobUseCase';
import { SearchJobsUseCase } from 'src/application/use-cases/job/SearchJobUseCase';
import { GetByIdUseCase } from 'src/application/use-cases/job/GetJobByIdUseCase';

@Module({
  imports: [RepositoriesModule],
  controllers: [JobController],
  providers: [
    PostJobUseCase,
    UpdateJobUseCase,
    CloseJobUseCase,
    SearchJobsUseCase,
    GetByIdUseCase,
  ],
})
export class JobModule {}
