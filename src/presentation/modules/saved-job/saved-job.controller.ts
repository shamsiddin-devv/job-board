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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { GetSavedJobsUseCase } from 'src/application/use-cases/saved-job/GetSavedJobsUseCase'
import { SaveJobUseCase } from 'src/application/use-cases/saved-job/SaveJobUseCase'
import { UnsaveJobUseCase } from 'src/application/use-cases/saved-job/UnsaveJobUseCase'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'


@ApiTags('Saved Jobs')
@ApiBearerAuth()
@Controller('saved-jobs')
@UseGuards(JwtAuthGuard)
export class SavedJobController {
  constructor(
    private readonly saveJobUseCase: SaveJobUseCase,
    private readonly unsaveJobUseCase: UnsaveJobUseCase,
    private readonly getSavedJobsUseCase: GetSavedJobsUseCase,
  ) {}

  @ApiOperation({ summary: 'Saqlangan barcha vakansiyalarni ko\'rish' })
  @ApiResponse({ status: 200, description: 'Saqlangan vakansiyalar ro\'yxati' })
  @Get()
  async getAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.getSavedJobsUseCase.execute(req.user.sub, page, limit)
  }

  @ApiOperation({ summary: 'Vakansiyani saqlash' })
  @ApiResponse({ status: 201, description: 'Vakansiya saqlandi' })
  @ApiResponse({ status: 409, description: 'Allaqachon saqlangan' })
  @Post(':jobId')
  async save(@Param('jobId') jobId: string, @Req() req) {
    return await this.saveJobUseCase.execute(req.user.sub, jobId)
  }

  @ApiOperation({ summary: 'Vakansiyani saqlashdan olib tashlash' })
  @ApiResponse({ status: 200, description: 'Saqlashdan olib tashlandi' })
  @ApiResponse({ status: 404, description: 'Saqlangan vakansiya topilmadi' })
  @Delete(':jobId')
  async unsave(@Param('jobId') jobId: string, @Req() req) {
    return await this.unsaveJobUseCase.execute(req.user.sub, jobId)
  }
}