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
import { CreateCompanyProfileUseCase } from 'src/application/use-cases/company/CreateCompanyProfileUseCase'
import { GetCompanyProfileUseCase } from 'src/application/use-cases/company/GetCompanyProfileUseCase'
import { UpdateCompanyProfileUseCase } from 'src/application/use-cases/company/UpdateCompanyProfileUseCase'
import { VerifyCompanyUseCase } from 'src/application/use-cases/company/VerifyCompanyUseCase'
import { CreateCompanyDto } from './dto/create-company.dto'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { UpdateCompanyDto } from './dto/update.dto'
import { RolesGuard } from 'src/presentation/guards/roles.guard'
import { Roles } from 'src/presentation/decorators/roles.decorator'

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyProfileUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyProfileUseCase,
    private readonly verifyCompanyUseCase: VerifyCompanyUseCase,
    private readonly getCompanyUseCase: GetCompanyProfileUseCase,
  ) {}

  // Public — kompaniya sahifasi
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.getCompanyUseCase.execute(id)
  }

  // Company o'z profilini birinchi marta yaratadi
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCompanyDto, @Req() req) {
    return await this.createCompanyUseCase.execute(req.user.sub, dto)
  }

  // Company o'z profilini tahrirlaydi
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Body() dto: UpdateCompanyDto, @Req() req) {
    return await this.updateCompanyUseCase.execute(req.user.sub, dto)
  }

  // Faqat ADMIN tasdiqlay oladi
  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async verify(@Param('id') id: string) {
    return await this.verifyCompanyUseCase.execute(id)
  }
}