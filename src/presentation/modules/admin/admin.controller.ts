import {
  BadRequestException,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PrismaService } from 'src/infrastructure/db/prisma/prisma.service'
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard'
import { RolesGuard } from 'src/presentation/guards/roles.guard'
import { Roles } from 'src/presentation/decorators/roles.decorator'

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  private paginate(page?: number, limit?: number) {
    const p = Number(page ?? 1)
    const l = Number(limit ?? 20)
    if (!Number.isInteger(p) || p < 1 || p > 10000 || !Number.isInteger(l) || l < 1 || l > 100) {
      throw new BadRequestException('Invalid pagination.');
    }
    return { p, l, skip: (p - 1) * l, take: l }
  }

  private wrap(data: any[], total: number, p: number, l: number) {
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) }
  }

  @ApiOperation({ summary: 'Platforma statistikasi' })
  @ApiResponse({ status: 200, description: 'Statistika' })
  @Get('stats')
  async stats() {
    const [totalUsers, totalCompanies, totalJobs, totalApplications, pendingVerifications] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.company.count(),
        this.prisma.job.count(),
        this.prisma.application.count(),
        this.prisma.company.count({ where: { isVerified: false } }),
      ])
    return { totalUsers, totalCompanies, totalJobs, totalApplications, pendingVerifications }
  }

  @ApiOperation({ summary: 'Foydalanuvchilar ro\'yxati' })
  @Get('users')
  async users(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const { p, l, skip, take } = this.paginate(page, limit)
    const where: any = {}
    if (role && !['ADMIN', 'COMPANY', 'WORKER'].includes(role.toUpperCase())) throw new BadRequestException('Invalid role.');
    if (role) where.role = role.toUpperCase()
    if (status === 'active') where.isActive = true
    if (status === 'inactive') where.isActive = false
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          avatarUrl: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ])
    const data = rows.map((u) => ({ ...u, role: u.role.toLowerCase() }))
    return this.wrap(data, total, p, l)
  }

  @ApiOperation({ summary: 'Foydalanuvchini faollashtirish' })
  @Patch('users/:id/activate')
  async activate(@Param('id') id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: true }, select: { id: true, isActive: true } })
  }

  @ApiOperation({ summary: 'Foydalanuvchini bloklash' })
  @Patch('users/:id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({ where: { id }, data: { isActive: false }, select: { id: true, isActive: true } });
      await tx.refreshToken.updateMany({ where: { userId: id }, data: { isRevoked: true } });
      return user;
    });
  }

  @ApiOperation({ summary: 'Kompaniyalar (tasdiqlash navbati)' })
  @Get('companies')
  async companies(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('verified') verified?: string,
  ) {
    const { p, l, skip, take } = this.paginate(page, limit)
    const where: any = {}
    if (verified === 'true') where.isVerified = true
    if (verified === 'false') where.isVerified = false
    const [rows, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { user: { select: { id: true, fullName: true, email: true } } },
      }),
      this.prisma.company.count({ where }),
    ])
    return this.wrap(rows, total, p, l)
  }

  @ApiOperation({ summary: 'Vakansiyalar moderatsiyasi' })
  @Get('jobs')
  async jobs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const { p, l, skip, take } = this.paginate(page, limit)
    const where: any = {}
    if (search) where.title = { contains: search, mode: 'insensitive' }
    const [rows, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { user: { select: { id: true, fullName: true, email: true } } },
      }),
      this.prisma.job.count({ where }),
    ])
    const data = rows.map((j: any) => ({
      ...j,
      postType: j.postType.toLowerCase(),
      status: j.status.toLowerCase(),
      jobType: j.jobType.toLowerCase(),
      workFormat: j.workFormat.toLowerCase(),
    }))
    return this.wrap(data, total, p, l)
  }

  @ApiOperation({ summary: 'Vakansiyani o\'chirish (moderatsiya)' })
  @Delete('jobs/:id')
  async removeJob(@Param('id') id: string) {
    await this.prisma.job.delete({ where: { id } })
    return { message: 'Job removed successfully.' }
  }

  @ApiOperation({ summary: 'Barcha arizalar' })
  @Get('applications')
  async applications(@Query('page') page?: number, @Query('limit') limit?: number) {
    const { p, l, skip, take } = this.paginate(page, limit)
    const [rows, total] = await Promise.all([
      this.prisma.application.findMany({
        orderBy: { appliedAt: 'desc' },
        skip,
        take,
        include: {
          job: { select: { id: true, title: true } },
          applicant: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.application.count(),
    ])
    const data = rows.map((a: any) => ({ ...a, status: a.status.toLowerCase() }))
    return this.wrap(data, total, p, l)
  }
}
