import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CompanyFilters, CompanyListResult, ICompanyRepository } from 'src/domain/repositories/ICompanyRepository'
import { Company } from 'src/domain/entities/Company'

@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Company | null> {
    const row = await this.prisma.company.findUnique({ where: { id } })
    if (!row) return null
    return this.toDomain(row)
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const row = await this.prisma.company.findUnique({ where: { userId } })
    if (!row) return null
    return this.toDomain(row)
  }

  async findAll(filters: CompanyFilters): Promise<CompanyListResult> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const where: Prisma.CompanyWhereInput = {}

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified
    }

    if (filters.industry) {
      where.industry = { equals: filters.industry, mode: 'insensitive' }
    }

    if (filters.city) {
      where.city = { equals: filters.city, mode: 'insensitive' }
    }

    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' }
    }

    const [rows, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.company.count({ where }),
    ])

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async create(company: Company): Promise<Company> {
    const row = await this.prisma.company.create({
      data: this.toPersistence(company),
    })
    return this.toDomain(row)
  }

  async update(id: string, company: Company): Promise<Company> {
    const row = await this.prisma.company.update({
      where: { id },
      data: this.toPersistence(company),
    })
    return this.toDomain(row)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({ where: { id } })
  }

  private toDomain(row: any): Company {
    return new Company({
      id: row.id,
      userId: row.userId,
      name: row.name,
      description: row.description ?? undefined,
      website: row.website ?? undefined,
      logoUrl: row.logoUrl ?? undefined,
      industry: row.industry ?? undefined,
      size: row.size ?? undefined,
      city: row.city ?? undefined,
      isVerified: row.isVerified,
      createdAt: row.createdAt,
    })
  }

  private toPersistence(company: Company): any {
    return {
      userId: company.userId,
      name: company.name,
      description: company.description,
      website: company.website,
      logoUrl: company.logoUrl,
      industry: company.industry,
      size: company.size,
      city: company.city,
      isVerified: company.isVerified,
    }
  }
}