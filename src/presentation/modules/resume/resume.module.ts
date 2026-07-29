import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/infrastructure/repositories.module';
import { ResumeController } from './resume.controller';
import { CreateResumeUseCase } from 'src/application/use-cases/resume/CreateResumeUseCase';
import { UploadResumeFileUseCase } from 'src/application/use-cases/resume/UploadResumeFileUseCase';
import { CloseResumeUseCase } from 'src/application/use-cases/resume/CloseResumeUseCase';
import { SearchResumesUseCase } from 'src/application/use-cases/resume/SearchResumesUseCase';

@Module({
  imports: [RepositoriesModule],
  controllers: [ResumeController],
  providers: [
    CreateResumeUseCase,
    UploadResumeFileUseCase,
    CloseResumeUseCase,
    SearchResumesUseCase,
  ],
})
export class ResumeModule {}
