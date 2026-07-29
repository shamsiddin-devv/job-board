import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/db/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AuthModule } from './presentation/modules/auth/auth.module';
import { ApplicationModule } from './presentation/modules/application/application.module';
import { CompanyModule } from './presentation/modules/company/company.module';
import { JobModule } from './presentation/modules/job/job.module';
import { NotificationModule } from './presentation/modules/notification/notification.module';
import { ResumeModule } from './presentation/modules/resume/resume.module';
import { SavedJobModule } from './presentation/modules/saved-job/saved-job.module';
  
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
  ],
  controllers: [],
  providers: [
    PrismaModule,
    RedisModule,
    AuthModule,
    ApplicationModule,
    CompanyModule,
    JobModule,
    NotificationModule,
    ResumeModule,
    SavedJobModule
  ],
})
export class AppModule {}
