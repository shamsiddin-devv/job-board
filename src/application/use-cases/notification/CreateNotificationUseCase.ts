import { Notification, NotificationType } from "src/domain/entities/Notification"
import { INotificationRepository } from "src/domain/repositories/INotificationRepository"

export class CreateNotificationUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}
 
  async execute(userId: string, type: NotificationType, message: string) {
    const notification = new Notification({ userId, type, message })
    return await this.notificationRepo.create(notification);
  }
}