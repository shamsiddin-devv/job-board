import { Notification } from '../entities/Notification'

export interface NotificationFilters {
  userId: string
  isRead?: boolean
  page?: number
  limit?: number
}

export interface NotificationListResult {
  data: Notification[]
  total: number
  unreadCount: number
  page: number
  limit: number
  totalPages: number
}

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>
  findAll(filters: NotificationFilters): Promise<NotificationListResult>
  create(notification: Notification): Promise<Notification>
  update(id: string, notification: Notification): Promise<Notification>
  markAllAsRead(userId: string): Promise<void>
}