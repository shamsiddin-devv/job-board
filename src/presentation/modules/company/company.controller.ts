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
import { CreateCompanyProfileUseCase } from 'src/application/use-cases/company/CreateCompanyProfileUseCase'
import { GetCompanyProfileUseCase } from 'src/application/use-cases/company/GetCompanyProfileUseCase'
import { UpdateCompanyProfileUseCase } from 'src/application/use-cases/company/UpdateCompanyProfileUseCase'
import { VerifyCompanyUseCase } from 'src/application/use-cases/company/VerifyCompanyUseCase'
import { SearchCompaniesUseCase } from 'src/application/use-cases/company/SearchCompaniesUseCase'
import { GetMyCompanyUseCase } from 'src/application/use-cases/company/GetMyCompanyUseCase'
import { UploadCompanyLogoUseCase } from 'src/application/use-cases/company/UploadCompanyLogoUseCase'
import { CreateCompanyDto } from './dto/create-company.dto'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { UpdateCompanyDto } from './dto/update.dto'
import { SearchCompaniesQueryDto } from './dto/search-company.dto'
import { RolesGuard } from 'src/presentation/guards/roles.guard'
import { Roles } from 'src/presentation/decorators/roles.decorator'
import { multerConfig } from 'src/infrastructure/upload/multer.config'


@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyProfileUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyProfileUseCase,
    private readonly verifyCompanyUseCase: VerifyCompanyUseCase,
    private readonly getCompanyUseCase: GetCompanyProfileUseCase,
    private readonly searchCompaniesUseCase: SearchCompaniesUseCase,
    private readonly getMyCompanyUseCase: GetMyCompanyUseCase,
    private readonly uploadCompanyLogoUseCase: UploadCompanyLogoUseCase,
  ) {}

  @ApiOperation({ summary: 'Kompaniyalarni qidirish (public)' })
  @ApiResponse({ status: 200, description: 'Kompaniyalar ro\'yxati' })
  @Get()
  async search(@Query() query: SearchCompaniesQueryDto) {
    return await this.searchCompaniesUseCase.execute(query)
  }

  @ApiOperation({ summary: 'O\'z kompaniya profilim' })
  @ApiResponse({ status: 200, description: 'Kompaniya topildi' })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req) {
    return await this.getMyCompanyUseCase.execute(req.user.sub)
  }

  @ApiOperation({ summary: 'Kompaniya profilini ID orqali ko\'rish (public)' })
  @ApiResponse({ status: 200, description: 'Kompaniya topildi' })
  @ApiResponse({ status: 404, description: 'Kompaniya topilmadi' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getCompanyUseCase.execute(id)
  }

  @ApiOperation({ summary: 'Kompaniya profilini birinchi marta yaratish' })
  @ApiResponse({ status: 201, description: 'Profil yaratildi' })
  @ApiResponse({ status: 409, description: 'Profil allaqachon mavjud' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCompanyDto, @Req() req) {
    return await this.createCompanyUseCase.execute(req.user.sub, dto)
  }

  @ApiOperation({ summary: 'O\'z kompaniya profilini tahrirlash' })
  @ApiResponse({ status: 200, description: 'Profil yangilandi' })
  @ApiBearerAuth()
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Body() dto: UpdateCompanyDto, @Req() req) {
    return await this.updateCompanyUseCase.execute(req.user.sub, dto)
  }

  @ApiOperation({ summary: 'Kompaniya logotipini yuklash' })
  @ApiResponse({ status: 200, description: 'Logo yuklandi' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiBearerAuth()
  @Post('logo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadLogo(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return await this.uploadCompanyLogoUseCase.execute(req.user.sub, file.buffer)
  }

  @ApiOperation({ summary: 'Kompaniyani tasdiqlash (faqat ADMIN)' })
  @ApiResponse({ status: 200, description: 'Kompaniya tasdiqlandi' })
  @ApiResponse({ status: 403, description: 'Faqat admin bajara oladi' })
  @ApiBearerAuth()
  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async verify(@Param('id') id: string) {
    return await this.verifyCompanyUseCase.execute(id)
  }
}