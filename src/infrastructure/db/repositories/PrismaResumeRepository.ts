import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  IResumeRepository,
  ResumeFilters,
  ResumeListResult,
} from 'src/domain/repositories/IResumeRepository';
import { Resume } from 'src/domain/entities/Resume';
import { SalaryRange } from 'src/domain/value-objects/Salary';

@Injectable()
export class PrismaResumeRepository implements IResumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Resume | null> {
    const row = await this.prisma.resume.findUnique({ where: { id } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findByUserId(userId: string): Promise<Resume | null> {
    const row = await this.prisma.resume.findFirst({ where: { userId } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findAll(filters: ResumeFilters): Promise<ResumeListResult> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const where: Prisma.ResumeWhereInput = { status: 'ACTIVE' };

    if (filters.city) {
      where.city = { equals: filters.city, mode: 'insensitive' };
    }

    if (filters.salaryMin !== undefined) {
      where.salaryMin = { gte: filters.salaryMin };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { summary: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      this.prisma.resume.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.resume.count({ where }),
    ]);

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(resume: Resume): Promise<Resume> {
    const row = await this.prisma.resume.create({
      data: this.toPersistence(resume),
    });
    return this.toDomain(row);
  }

  async update(id: string, resume: Resume): Promise<Resume> {
    const row = await this.prisma.resume.update({
      where: { id },
      data: this.toPersistence(resume),
    });
    return this.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.resume.delete({ where: { id } });
  }

  private toDomain(row: any): Resume {
    return new Resume({
      id: row.id,
      userId: row.userId,
      title: row.title,
      summary: row.summary ?? undefined,
      city: row.city ?? undefined,
      salaryRange:
        row.salaryMin || row.salaryMax
          ? new SalaryRange({
              min: row.salaryMin ?? undefined,
              max: row.salaryMax ?? undefined,
              currency: row.currency,
            })
          : undefined,
      fileUrl: row.fileUrl ?? undefined,
      status: row.status.toLowerCase(),
      createdAt: row.createdAt,
    });
  }

  private toPersistence(resume: Resume): any {
    return {
      userId: resume.userId,
      title: resume.title,
      summary: resume.summary,
      city: resume.city,
      salaryMin: resume.salaryRange?.min ?? null,
      salaryMax: resume.salaryRange?.max ?? null,
      currency: resume.salaryRange?.currency ?? 'UZS',
      fileUrl: resume.fileUrl,
      status: resume.status.toUpperCase(),
    };
  }
}
