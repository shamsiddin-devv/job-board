import { NOTIFICATION_MESSAGES } from "src/domain/constants/message"
import { INotificationRepository } from "src/domain/repositories/INotificationRepository"

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}
 
  async execute(userId: string) {
    await this.notificationRepo.markAllAsRead(userId)
    return { message: NOTIFICATION_MESSAGES.ALL_NOTIFICATION_MARKED };
  }
}