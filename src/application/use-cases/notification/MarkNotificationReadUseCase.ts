import { NotFoundError } from "src/domain/errors/NotFoundError"
import { UnauthorizedError } from "src/domain/errors/UnauthorizedError"
import { INotificationRepository } from "src/domain/repositories/INotificationRepository"

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}
 
  async execute(notificationId: string, userId: string) {
    const notification = await this.notificationRepo.findById(notificationId)
    if (!notification) throw new NotFoundError('Bildirishnoma')
 
    if (notification.userId !== userId)
      throw new UnauthorizedError('Bu bildirishnoma sizga tegishli emas')
 
    notification.markAsRead()
 
    return await this.notificationRepo.update(notificationId, notification)
  }
}