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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger'
import { CloseResumeUseCase } from 'src/application/use-cases/resume/CloseResumeUseCase'
import { CreateResumeUseCase } from 'src/application/use-cases/resume/CreateResumeUseCase'
import { SearchResumesUseCase } from 'src/application/use-cases/resume/SearchResumesUseCase'
import { UploadResumeFileUseCase } from 'src/application/use-cases/resume/UploadResumeFileUseCase'
import { SearchResumesQueryDto } from './dto/search-resume.dto'
import { CreateResumeDto } from './dto/create-resume.dto'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { multerConfig } from 'src/infrastructure/upload/multer.config'

@ApiTags('Resumes')
@Controller('resumes')
export class ResumeController {
  constructor(
    private readonly createResumeUseCase: CreateResumeUseCase,
    private readonly uploadResumeFileUseCase: UploadResumeFileUseCase,
    private readonly closeResumeUseCase: CloseResumeUseCase,
    private readonly searchResumesUseCase: SearchResumesUseCase,
  ) {}

  @ApiOperation({ summary: 'Workerlarni (CV larni) qidirish — public' })
  @ApiResponse({ status: 200, description: 'CV lar ro\'yxati' })
  @Get()
  async search(@Query() query: SearchResumesQueryDto) {
    return await this.searchResumesUseCase.execute(query)
  }

  @ApiOperation({ summary: 'Yangi CV profili yaratish' })
  @ApiResponse({ status: 201, description: 'CV yaratildi' })
  @ApiResponse({ status: 409, description: 'CV allaqachon mavjud' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateResumeDto, @Req() req) {
    return await this.createResumeUseCase.execute(req.user.sub, dto)
  }

  @ApiOperation({ summary: 'CV faylini (PDF) yuklash' })
  @ApiResponse({ status: 200, description: 'Fayl yuklandi' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiBearerAuth()
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return await this.uploadResumeFileUseCase.execute(req.user.sub, file.buffer)
  }

  @ApiOperation({ summary: 'Ish qidiruvni to\'xtatish' })
  @ApiResponse({ status: 200, description: 'CV yopildi' })
  @ApiBearerAuth()
  @Patch('close')
  @UseGuards(JwtAuthGuard)
  async close(@Req() req) {
    return await this.closeResumeUseCase.execute(req.user.sub)
  }
}