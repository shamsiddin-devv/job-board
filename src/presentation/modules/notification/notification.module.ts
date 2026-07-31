import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'
import type { INotificationRepository } from 'src/domain/repositories/INotificationRepository'
import { CreateNotificationUseCase } from 'src/application/use-cases/notification/CreateNotificationUseCase'
import { GetNotificationsUseCase } from 'src/application/use-cases/notification/GetNotificationsUseCase'
import { MarkNotificationReadUseCase } from 'src/application/use-cases/notification/MarkNotificationReadUseCase'
import { MarkAllNotificationsReadUseCase } from 'src/application/use-cases/notification/MarkAllNotificationsReadUseCase'

@Module({
  imports: [RepositoriesModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: CreateNotificationUseCase,
      useFactory: (notificationRepo: INotificationRepository) =>
        new CreateNotificationUseCase(notificationRepo),
      inject: ['INotificationRepository'],
    },
    {
      provide: GetNotificationsUseCase,
      useFactory: (notificationRepo: INotificationRepository) =>
        new GetNotificationsUseCase(notificationRepo),
      inject: ['INotificationRepository'],
    },
    {
      provide: MarkNotificationReadUseCase,
      useFactory: (notificationRepo: INotificationRepository) =>
        new MarkNotificationReadUseCase(notificationRepo),
      inject: ['INotificationRepository'],
    },
    {
      provide: MarkAllNotificationsReadUseCase,
      useFactory: (notificationRepo: INotificationRepository) =>
        new MarkAllNotificationsReadUseCase(notificationRepo),
      inject: ['INotificationRepository'],
    },
  ],
  exports: [CreateNotificationUseCase],
})
export class NotificationModule {}