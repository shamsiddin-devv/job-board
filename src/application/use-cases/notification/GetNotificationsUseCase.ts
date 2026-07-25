import { INotificationRepository } from "src/domain/repositories/INotificationRepository";

export class GetNotificationsUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}
 
  async execute(userId: string, page?: number, limit?: number) {
    return await this.notificationRepo.findAll({ userId, page, limit })
  }
}