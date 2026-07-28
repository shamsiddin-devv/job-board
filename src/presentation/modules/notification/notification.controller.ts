import { Controller, Get, Patch, Param, Query, Req, UseGuards } from '@nestjs/common'
import { GetNotificationsUseCase } from 'src/application/use-cases/notification/GetNotificationsUseCase'
import { MarkAllNotificationsReadUseCase } from 'src/application/use-cases/notification/MarkAllNotificationsReadUseCase'
import { MarkNotificationReadUseCase } from 'src/application/use-cases/notification/MarkNotificationReadUseCase'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly markReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  async getAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.getNotificationsUseCase.execute(req.user.sub, page, limit)
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req) {
    return await this.markReadUseCase.execute(id, req.user.sub)
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req) {
    return await this.markAllReadUseCase.execute(req.user.sub)
  }
}