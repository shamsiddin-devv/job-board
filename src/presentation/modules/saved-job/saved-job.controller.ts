import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'
import { SaveJobUseCase } from 'src/application/use-cases/saved-job/SaveJobUseCase'
import { UnsaveJobUseCase } from 'src/application/use-cases/saved-job/UnsaveJobUseCase'
import { GetSavedJobsUseCase } from 'src/application/use-cases/saved-job/GetSavedJobsUseCase'

@Controller('saved-jobs')
@UseGuards(JwtAuthGuard)
export class SavedJobController {
  constructor(
    private readonly saveJobUseCase: SaveJobUseCase,
    private readonly unsaveJobUseCase: UnsaveJobUseCase,
    private readonly getSavedJobsUseCase: GetSavedJobsUseCase,
  ) {}

  @Get()
  async getAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.getSavedJobsUseCase.execute(req.user.sub, page, limit)
  }

  @Post(':jobId')
  async save(@Param('jobId') jobId: string, @Req() req) {
    return await this.saveJobUseCase.execute(req.user.sub, jobId)
  }

  @Delete(':jobId')
  async unsave(@Param('jobId') jobId: string, @Req() req) {
    return await this.unsaveJobUseCase.execute(req.user.sub, jobId)
  }
}