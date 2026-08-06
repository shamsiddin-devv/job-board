import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { Job } from '../../../domain/entities/Job'
import { IJobRepository, JobFilters, JobListResult } from 'src/domain/repositories/IJobRespository'
import { SalaryRange } from 'src/domain/value-objects/Salary'


@Injectable()
export class PrismaJobRepository implements IJobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Job | null> {
    const row = await this.prisma.job.findUnique({ where: { id } })
    if (!row) return null
    return this.toDomain(row)
  }

  async findAll(filters: JobFilters): Promise<JobListResult> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const where: Prisma.JobWhereInput = {}

    where.status = filters.status
      ? filters.status.toUpperCase() as any
      : 'ACTIVE'

    if (filters.city) {
      where.city = { equals: filters.city, mode: 'insensitive' }
    }

    if (filters.postType) {
      where.postType = filters.postType.toUpperCase() as any
    }

    if (filters.jobType) {
      where.jobType = filters.jobType.toUpperCase() as any
    }

    if (filters.workFormat) {
      where.workFormat = filters.workFormat.toUpperCase() as any
    }

    if (filters.salaryMin !== undefined) {
      where.salaryMax = { gte: filters.salaryMin }
    }

    if (filters.salaryMax !== undefined) {
      where.salaryMin = { lte: filters.salaryMax }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const orderBy = this.buildOrderBy(filters.sortBy)

    const [rows, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.job.count({ where }),
    ])

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async create(job: Job): Promise<Job> {
    const row = await this.prisma.job.create({
      data: this.toPersistence(job),
    })
    return this.toDomain(row)
  }

  async update(id: string, job: Job): Promise<Job> {
    const row = await this.prisma.job.update({
      where: { id },
      data: this.toPersistence(job),
    })
    return this.toDomain(row)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.job.delete({ where: { id } })
  }

  private buildOrderBy(sortBy?: string): Prisma.JobOrderByWithRelationInput {
    switch (sortBy) {
      case 'salary_high':
        return { salaryMax: 'desc' }
      case 'salary_low':
        return { salaryMin: 'asc' }
      case 'most_viewed':
        return { viewsCount: 'desc' }
      case 'newest':
      default:
        return { createdAt: 'desc' }
    }
  }

  private toDomain(row: any): Job {
    return new Job({
      id: row.id,
      userId: row.userId,
      title: row.title,
      description: row.description ?? undefined,
      postType: row.postType.toLowerCase(),
      jobType: row.jobType.toLowerCase(),
      workFormat: row.workFormat.toLowerCase(),
      city: row.city ?? undefined,
      salaryRange:
        row.salaryMin || row.salaryMax
          ? new SalaryRange({
              min: row.salaryMin ?? undefined,
              max: row.salaryMax ?? undefined,
              currency: row.currency,
            })
          : undefined,
      status: row.status.toLowerCase(),
      viewsCount: row.viewsCount,
      createdAt: row.createdAt,
    })
  }

  private toPersistence(job: Job): any {
    return {
      userId: job.userId,
      title: job.title,
      description: job.description,
      postType: job.postType.toUpperCase(),
      jobType: job.jobType.toUpperCase(),
      workFormat: job.workFormat.toUpperCase(),
      city: job.city,
      salaryMin: job.salaryRange?.min ?? null,
      salaryMax: job.salaryRange?.max ?? null,
      currency: job.salaryRange?.currency ?? 'UZS',
      status: job.status.toUpperCase(),
      viewsCount: job.viewsCount,
    }
  }
}