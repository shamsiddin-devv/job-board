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
import { AcceptApplicationUseCase } from 'src/application/use-cases/application/AcceptApplicationUseCase'
import { ApplyToJobUseCase } from 'src/application/use-cases/application/ApplyToJobUseCase'
import { GetApplicantsUseCase } from 'src/application/use-cases/application/GetApplicantsUseCase'
import { GetMyApplicationsUseCase } from 'src/application/use-cases/application/GetMyApplicationsUseCase'
import { RejectApplicationUseCase } from 'src/application/use-cases/application/RejectApplicationUseCase'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { ApplyToJobDto } from './dto/application.dto'

@Controller()
export class ApplicationController {
  constructor(
    private readonly applyToJobUseCase: ApplyToJobUseCase,
    private readonly acceptApplicationUseCase: AcceptApplicationUseCase,
    private readonly rejectApplicationUseCase: RejectApplicationUseCase,
    private readonly getApplicantsUseCase: GetApplicantsUseCase,
    private readonly getMyApplicationsUseCase: GetMyApplicationsUseCase,
  ) {}

  @Post('jobs/:jobId/apply')
  @UseGuards(JwtAuthGuard)
  async apply(
    @Param('jobId') jobId: string,
    @Body() dto: ApplyToJobDto,
    @Req() req,
  ) {
    return await this.applyToJobUseCase.execute(jobId, req.user.sub, dto)
  }

  @Patch('applications/:id/accept')
  @UseGuards(JwtAuthGuard)
  async accept(@Param('id') id: string, @Req() req) {
    return await this.acceptApplicationUseCase.execute(id, req.user.sub)
  }

  @Patch('applications/:id/reject')
  @UseGuards(JwtAuthGuard)
  async reject(@Param('id') id: string, @Req() req) {
    return await this.rejectApplicationUseCase.execute(id, req.user.sub)
  }

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