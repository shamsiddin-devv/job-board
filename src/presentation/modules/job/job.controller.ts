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
import { CloseJobUseCase } from 'src/application/use-cases/job/CloseJobUseCase'
import { GetByIdUseCase } from 'src/application/use-cases/job/GetJobByIdUseCase'
import { PostJobUseCase } from 'src/application/use-cases/job/PostJobUseCase'
import { SearchJobsUseCase } from 'src/application/use-cases/job/SearchJobUseCase'
import { UpdateJobUseCase } from 'src/application/use-cases/job/UpdateJobUseCase'
import { SearchJobsQueryDto } from './dto/search-job-query.dto'
import { PostJobDto } from './dto/post-job.dto'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { UpdateJobDto } from './dto/update-job.dto'


@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(
    private readonly postJobUseCase: PostJobUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly closeJobUseCase: CloseJobUseCase,
    private readonly searchJobsUseCase: SearchJobsUseCase,
    private readonly getByIdUseCase: GetByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Vakansiyalarni filter va sort bilan qidirish' })
  @ApiResponse({ status: 200, description: 'Vakansiyalar ro\'yxati qaytariladi' })
  @Get()
  async search(@Query() query: SearchJobsQueryDto) {
    return await this.searchJobsUseCase.execute(query)
  }

  @ApiOperation({ summary: 'Bitta vakansiyani ID orqali olish' })
  @ApiResponse({ status: 200, description: 'Vakansiya topildi' })
  @ApiResponse({ status: 404, description: 'Vakansiya topilmadi' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getByIdUseCase.execute(id)
  }

  @ApiOperation({ summary: 'Yangi vakansiya yoki CV posti yaratish' })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 401, description: 'Login qilinmagan' })
  @ApiResponse({ status: 403, description: 'Ruxsat yo\'q (masalan kompaniya tasdiqlanmagan)' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: PostJobDto, @Req() req) {
    return await this.postJobUseCase.execute(dto, req.user.sub)
  }

  @ApiOperation({ summary: 'Mavjud vakansiyani tahrirlash' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 401, description: 'Bu vakansiya egasi emassiz' })
  @ApiResponse({ status: 404, description: 'Vakansiya topilmadi' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
    @Req() req,
  ) {
    return await this.updateJobUseCase.execute(id, dto, req.user.sub)
  }

  @ApiOperation({ summary: 'Vakansiyani yopish' })
  @ApiResponse({ status: 200, description: 'Vakansiya yopildi' })
  @ApiResponse({ status: 404, description: 'Vakansiya topilmadi' })
  @ApiBearerAuth()
  @Patch(':id/close')
  @UseGuards(JwtAuthGuard)
  async close(@Param('id') id: string, @Req() req) {
    return await this.closeJobUseCase.execute(id, req.user.sub)
  }
}