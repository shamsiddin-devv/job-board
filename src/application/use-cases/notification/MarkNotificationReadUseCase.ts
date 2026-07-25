import { NOTIFICATION_MESSAGES } from "src/domain/constants/message"
import { ForbiddenError } from "src/domain/errors/ForbiddenError"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { INotificationRepository } from "src/domain/repositories/INotificationRepository"

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}
 
  async execute(notificationId: string, userId: string) {
    const notification = await this.notificationRepo.findById(notificationId)
    if (!notification) throw new NotFoundError(NOTIFICATION_MESSAGES.NOTIFICATION_NOT_FOUND)
 
    if (notification.userId !== userId)
      throw new ForbiddenError(NOTIFICATION_MESSAGES.NOT_PERMISSION);
 
    notification.markAsRead()
 
    return await this.notificationRepo.update(notificationId, notification)
  }
}