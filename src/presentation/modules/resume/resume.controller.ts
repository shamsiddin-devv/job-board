import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CloseResumeUseCase } from 'src/application/use-cases/resume/CloseResumeUseCase'
import { CreateResumeUseCase } from 'src/application/use-cases/resume/CreateResumeUseCase'
import { SearchResumesUseCase } from 'src/application/use-cases/resume/SearchResumesUseCase'
import { UploadResumeFileUseCase } from 'src/application/use-cases/resume/UploadResumeFileUseCase'
import { SearchResumesQueryDto } from './dto/search-resume.dto'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { CreateResumeDto } from './dto/create-resume.dto'
import { multerConfig } from 'src/infrastructure/upload/multer.config'


@Controller('resumes')
export class ResumeController {
  constructor(
    private readonly createResumeUseCase: CreateResumeUseCase,
    private readonly uploadResumeFileUseCase: UploadResumeFileUseCase,
    private readonly closeResumeUseCase: CloseResumeUseCase,
    private readonly searchResumesUseCase: SearchResumesUseCase,
  ) {}

  @Get()
  async search(@Query() query: SearchResumesQueryDto) {
    return await this.searchResumesUseCase.execute(query)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateResumeDto, @Req() req) {
    return await this.createResumeUseCase.execute(req.user.sub, dto)
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return await this.uploadResumeFileUseCase.execute(req.user.sub, file.buffer)
  }

  @Patch('close')
  @UseGuards(JwtAuthGuard)
  async close(@Req() req) {
    return await this.closeResumeUseCase.execute(req.user.sub)
  }
}