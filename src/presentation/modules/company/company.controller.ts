import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { CreateCompanyProfileUseCase } from 'src/application/use-cases/company/CreateCompanyProfileUseCase'
import { GetCompanyProfileUseCase } from 'src/application/use-cases/company/GetCompanyProfileUseCase'
import { UpdateCompanyProfileUseCase } from 'src/application/use-cases/company/UpdateCompanyProfileUseCase'
import { VerifyCompanyUseCase } from 'src/application/use-cases/company/VerifyCompanyUseCase'
import { CreateCompanyDto } from './dto/create-company.dto'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { UpdateCompanyDto } from './dto/update.dto'
import { RolesGuard } from 'src/presentation/guards/roles.guard'
import { Roles } from 'src/presentation/decorators/roles.decorator'


@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyProfileUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyProfileUseCase,
    private readonly verifyCompanyUseCase: VerifyCompanyUseCase,
    private readonly getCompanyUseCase: GetCompanyProfileUseCase,
  ) {}

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