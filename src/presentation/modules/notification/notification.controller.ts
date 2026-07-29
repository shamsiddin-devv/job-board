import { Controller, Get, Patch, Param, Query, Req, UseGuards } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { GetNotificationsUseCase } from 'src/application/use-cases/notification/GetNotificationsUseCase'
import { MarkAllNotificationsReadUseCase } from 'src/application/use-cases/notification/MarkAllNotificationsReadUseCase'
import { MarkNotificationReadUseCase } from 'src/application/use-cases/notification/MarkNotificationReadUseCase'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly markReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @ApiOperation({ summary: 'Barcha bildirishnomalarni ko\'rish' })
  @ApiResponse({ status: 200, description: 'Bildirishnomalar ro\'yxati' })
  @Get()
  async getAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.getNotificationsUseCase.execute(req.user.sub, page, limit)
  }

  @ApiOperation({ summary: 'Bitta bildirishnomani o\'qilgan deb belgilash' })
  @ApiResponse({ status: 200, description: 'O\'qilgan deb belgilandi' })
  @ApiResponse({ status: 404, description: 'Bildirishnoma topilmadi' })
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req) {
    return await this.markReadUseCase.execute(id, req.user.sub)
  }

  @ApiOperation({ summary: 'Barcha bildirishnomalarni o\'qilgan deb belgilash' })
  @ApiResponse({ status: 200, description: 'Barchasi o\'qilgan deb belgilandi' })
  @Patch('read-all')
  async markAllAsRead(@Req() req) {
    return await this.markAllReadUseCase.execute(req.user.sub)
  }
}