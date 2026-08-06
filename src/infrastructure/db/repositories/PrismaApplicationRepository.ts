import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ApplicationFilters, ApplicationListResult, IApplicationRepository } from 'src/domain/repositories/IApplicationRepository'
import { Application } from 'src/domain/entities/Application'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaApplicationRepository implements IApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Application | null> {
    const row = await this.prisma.application.findUnique({ where: { id } })
    if (!row) return null
    return this.toDomain(row)
  }

  async findByJobAndApplicant(
    jobId: string,
    applicantId: string,
  ): Promise<Application | null> {
    const row = await this.prisma.application.findUnique({
      where: {
        jobId_applicantId: { jobId, applicantId },
      },
    })
    if (!row) return null
    return this.toDomain(row)
  }

  async findAll(filters: ApplicationFilters): Promise<ApplicationListResult> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const where: Prisma.ApplicationWhereInput = {}

    if (filters.jobId) {
      where.jobId = filters.jobId
    }

    if (filters.applicantId) {
      where.applicantId = filters.applicantId
    }

    if (filters.status) {
      where.status = filters.status.toUpperCase() as any
    }

    const [rows, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        orderBy: { appliedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.application.count({ where }),
    ])

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async create(application: Application): Promise<Application> {
    const row = await this.prisma.application.create({
      data: this.toPersistence(application),
    })
    return this.toDomain(row)
  }

  async update(id: string, application: Application): Promise<Application> {
    const row = await this.prisma.application.update({
      where: { id },
      data: this.toPersistence(application),
    })
    return this.toDomain(row)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.application.delete({ where: { id } })
  }

  private toDomain(row: any): Application {
    return new Application({
      id: row.id,
      jobId: row.jobId,
      applicantId: row.applicantId,
      coverLetter: row.coverLetter ?? undefined,
      resumeUrl: row.resumeUrl ?? undefined,
      status: row.status.toLowerCase(),
      appliedAt: row.appliedAt,
    })
  }

  private toPersistence(application: Application): any {
    return {
      jobId: application.jobId,
      applicantId: application.applicantId,
      coverLetter: application.coverLetter,
      resumeUrl: application.resumeUrl,
      status: application.status.toUpperCase(),
    }
  }
}