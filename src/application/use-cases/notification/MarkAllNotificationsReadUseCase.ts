import { INotificationRepository } from "src/domain/repositories/INotificationRepository"

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}
 
  async execute(userId: string) {
    await this.notificationRepo.markAllAsRead(userId)
    return { message: 'Barcha bildirishnomalar o\'qilgan deb belgilandi' }
  }
}