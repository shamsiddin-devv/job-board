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
import { CloseJobUseCase } from 'src/application/use-cases/job/CloseJobUseCase'
import { GetByIdUseCase } from 'src/application/use-cases/job/GetJobByIdUseCase'
import { PostJobUseCase } from 'src/application/use-cases/job/PostJobUseCase'
import { SearchJobsUseCase } from 'src/application/use-cases/job/SearchJobUseCase'
import { UpdateJobUseCase } from 'src/application/use-cases/job/UpdateJobUseCase'
import { SearchJobsQueryDto } from './dto/search-job-query.dto'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { PostJobDto } from './dto/post-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'


@Controller('jobs')
export class JobController {
  constructor(
    private readonly postJobUseCase: PostJobUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly closeJobUseCase: CloseJobUseCase,
    private readonly searchJobsUseCase: SearchJobsUseCase,
    private readonly getByIdUseCase: GetByIdUseCase,
  ) {}

  @Get()
  async search(@Query() query: SearchJobsQueryDto) {
    return await this.searchJobsUseCase.execute(query)
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getByIdUseCase.execute(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: PostJobDto, @Req() req) {
    return await this.postJobUseCase.execute(dto, req.user.sub)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
    @Req() req,
  ) {
    return await this.updateJobUseCase.execute(id, dto, req.user.sub)
  }

  @Patch(':id/close')
  @UseGuards(JwtAuthGuard)
  async close(@Param('id') id: string, @Req() req) {
    return await this.closeJobUseCase.execute(id, req.user.sub);
  };
}