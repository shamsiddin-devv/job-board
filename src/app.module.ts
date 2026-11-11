import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/db/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AuthModule } from './presentation/modules/auth/auth.module';
import { ApplicationModule } from './presentation/modules/application/application.module';
import { CompanyModule } from './presentation/modules/company/company.module';
import { JobModule } from './presentation/modules/job/job.module';
import { NotificationModule } from './presentation/modules/notification/notification.module';
import { ResumeModule } from './presentation/modules/resume/resume.module';
import { SavedJobModule } from './presentation/modules/saved-job/saved-job.module';
import { AdminModule } from './presentation/modules/admin/admin.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './presentation/filters/domain.exeption.filter';
import { HealthController } from './presentation/modules/health/health.controller';
import { environmentSchema } from './infrastructure/config/environment';
import { RepositoriesModule } from './infrastructure/repositories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: environmentSchema,
      validationOptions: { abortEarly: false },
      skipProcessEnv: true,
    }),
    PrismaModule,
    RedisModule,
    RepositoriesModule,
    AuthModule,
    JobModule,
    ApplicationModule,
    CompanyModule,
    NotificationModule,
    ResumeModule,
    SavedJobModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_FILTER, useClass: DomainExceptionFilter }],
})
export class AppModule {}
