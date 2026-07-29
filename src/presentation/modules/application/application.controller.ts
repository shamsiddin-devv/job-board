import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'
import { ApplyToJobUseCase } from 'src/application/use-cases/application/ApplyToJobUseCase'
import { AcceptApplicationUseCase } from 'src/application/use-cases/application/AcceptApplicationUseCase'
import { RejectApplicationUseCase } from 'src/application/use-cases/application/RejectApplicationUseCase'
import { GetApplicantsUseCase } from 'src/application/use-cases/application/GetApplicantsUseCase'
import { GetMyApplicationsUseCase } from 'src/application/use-cases/application/GetMyApplicationsUseCase'
import { ApplyToJobDto } from './dto/application.dto'

@ApiTags('Applications')
@ApiBearerAuth()
@Controller()
export class ApplicationController {
  constructor(
    private readonly applyToJobUseCase: ApplyToJobUseCase,
    private readonly acceptApplicationUseCase: AcceptApplicationUseCase,
    private readonly rejectApplicationUseCase: RejectApplicationUseCase,
    private readonly getApplicantsUseCase: GetApplicantsUseCase,
    private readonly getMyApplicationsUseCase: GetMyApplicationsUseCase,
  ) {}

  @ApiOperation({ summary: 'Vakansiyaga ariza topshirish' })
  @ApiResponse({ status: 201, description: 'Ariza muvaffaqiyatli topshirildi' })
  @ApiResponse({ status: 409, description: 'Ariza allaqachon topshirilgan' })
  @Post('jobs/:jobId/apply')
  @UseGuards(JwtAuthGuard)
  async apply(
    @Param('jobId') jobId: string,
    @Body() dto: ApplyToJobDto,
    @Req() req,
  ) {
    return await this.applyToJobUseCase.execute(jobId, req.user.sub, dto)
  }

  @ApiOperation({ summary: 'Arizani qabul qilish (faqat vakansiya egasi)' })
  @ApiResponse({ status: 200, description: 'Ariza qabul qilindi' })
  @ApiResponse({ status: 401, description: 'Ruxsat yo\'q' })
  @Patch('applications/:id/accept')
  @UseGuards(JwtAuthGuard)
  async accept(@Param('id') id: string, @Req() req) {
    return await this.acceptApplicationUseCase.execute(id, req.user.sub)
  }

  @ApiOperation({ summary: 'Arizani rad etish (faqat vakansiya egasi)' })
  @ApiResponse({ status: 200, description: 'Ariza rad etildi' })
  @ApiResponse({ status: 401, description: 'Ruxsat yo\'q' })
  @Patch('applications/:id/reject')
  @UseGuards(JwtAuthGuard)
  async reject(@Param('id') id: string, @Req() req) {
    return await this.rejectApplicationUseCase.execute(id, req.user.sub)
  }

  @ApiOperation({ summary: 'Vakansiyaga kelgan barcha arizalarni ko\'rish' })
  @ApiResponse({ status: 200, description: 'Arizalar ro\'yxati' })
  @Get('jobs/:jobId/applicants')
  @UseGuards(JwtAuthGuard)
  async getApplicants(
    @Param('jobId') jobId: string,
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.getApplicantsUseCase.execute(
      jobId,
      req.user.sub,
      page,
      limit,
    )
  }

  @ApiOperation({ summary: 'O\'zim topshirgan barcha arizalarni ko\'rish' })
  @ApiResponse({ status: 200, description: 'Arizalar ro\'yxati' })
  @Get('applications/my')
  @UseGuards(JwtAuthGuard)
  async getMyApplications(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.getMyApplicationsUseCase.execute(
      req.user.sub,
      page,
      limit,
    )
  }
}