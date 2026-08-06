import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { INotificationRepository, NotificationFilters, NotificationListResult } from 'src/domain/repositories/INotificationRepository'
import { Notification } from 'src/domain/entities/Notification'

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const row = await this.prisma.notification.findUnique({ where: { id } })
    if (!row) return null
    return this.toDomain(row)
  }

  async findAll(filters: NotificationFilters): Promise<NotificationListResult> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const where: Prisma.NotificationWhereInput = { userId: filters.userId }

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead
    }

    const [rows, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId: filters.userId, isRead: false },
      }),
    ])

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      unreadCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async create(notification: Notification): Promise<Notification> {
    const row = await this.prisma.notification.create({
      data: this.toPersistence(notification),
    })
    return this.toDomain(row)
  }

  async update(id: string, notification: Notification): Promise<Notification> {
    const row = await this.prisma.notification.update({
      where: { id },
      data: this.toPersistence(notification),
    })
    return this.toDomain(row)
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
  }

  private toDomain(row: any): Notification {
    return new Notification({
      id: row.id,
      userId: row.userId,
      type: row.type,
      message: row.message,
      isRead: row.isRead,
      createdAt: row.createdAt,
    })
  }

  private toPersistence(notification: Notification): any {
    return {
      userId: notification.userId,
      type: notification.type,
      message: notification.message,
      isRead: notification.isRead,
    }
  }
}