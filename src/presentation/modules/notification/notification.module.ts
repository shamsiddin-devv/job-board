import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { RepositoriesModule } from 'src/infrastructure/repositories.module';
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/CreateNotificationUseCase';
import { GetNotificationsUseCase } from 'src/application/use-cases/notification/GetNotificationsUseCase';
import { MarkNotificationReadUseCase } from 'src/application/use-cases/notification/MarkNotificationReadUseCase';
import { MarkAllNotificationsReadUseCase } from 'src/application/use-cases/notification/MarkAllNotificationsReadUseCase';

@Module({
  imports: [RepositoriesModule],
  controllers: [NotificationController],
  providers: [
    CreateNotificationUseCase,
    GetNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
  ],
  exports: [CreateNotificationUseCase],
})
export class NotificationModule {}
