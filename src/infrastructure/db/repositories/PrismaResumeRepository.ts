import { Injectable } from '@nestjs/common';
import { Prisma, type Resume as ResumeRow } from '@prisma/client';
import type { CurrencyType } from 'src/domain/entities/Job';
import { PrismaService } from '../prisma/prisma.service';
import {
  IResumeRepository,
  ResumeFilters,
  ResumeListResult,
} from 'src/domain/repositories/IResumeRepository';
import { Resume, type ResumeStatusType } from 'src/domain/entities/Resume';
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

  private toDomain(row: ResumeRow): Resume {
    return new Resume({
      id: row.id,
      userId: row.userId,
      title: row.title,
      summary: row.summary ?? undefined,
      city: row.city ?? undefined,
      salaryRange:
        row.salaryMin != null
          ? new SalaryRange({
              min: row.salaryMin ?? undefined,
              currency: row.currency as CurrencyType,
            })
          : undefined,
      fileUrl: row.fileUrl ?? undefined,
      status: row.status.toLowerCase() as ResumeStatusType,
      createdAt: row.createdAt,
    });
  }

  private toPersistence(resume: Resume): Prisma.ResumeUncheckedCreateInput {
    return {
      userId: resume.userId,
      title: resume.title,
      summary: resume.summary,
      city: resume.city,
      salaryMin: resume.salaryRange?.min ?? null,
      currency: resume.salaryRange?.currency ?? 'UZS',
      fileUrl: resume.fileUrl,
      status: resume.status.toUpperCase() as Prisma.ResumeUncheckedCreateInput['status'],
    };
  }
}
