import { Injectable } from '@nestjs/common';
import { ISavedJobRepository, SavedJobListResult } from 'src/domain/repositories/ISavedJobRepository';
import { PrismaService } from '../prisma/prisma.service';
import { SavedJob } from 'src/domain/entities/SavedJob';

@Injectable()
export class PrismaSavedJobRepository implements ISavedJobRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(savedJobId: string): Promise<SavedJob | null> {
    const savedJob = await this.prismaService.savedJob.findUnique({
      where: { id: savedJobId },
    });
    if (!savedJob) return null;
    return this.toDomain(savedJob);
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<SavedJobListResult> {
    const [rows, total] = await Promise.all([
      this.prismaService.savedJob.findMany({
        where: { userId },
        orderBy: { savedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.savedJob.count({ where: { userId } }),
    ]);

    return {
      data: rows.map((row) => this.toDomain(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserAndJob(
    userId: string,
    jobId: string,
  ): Promise<SavedJob | null> {
    const row = await this.prismaService.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findAll(): Promise<SavedJob[]> {
    const savedJobs = await this.prismaService.savedJob.findMany();
    return savedJobs.map((savedJob) => this.toDomain(savedJob));
  }

  async create(data: SavedJob): Promise<SavedJob> {
    const row = await this.prismaService.savedJob.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  }

  async update(savedId: string, data: SavedJob): Promise<SavedJob> {
    const row = await this.prismaService.savedJob.update({
      where: { id: savedId },
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  }

  async delete(savedJobId: string): Promise<void> {
    await this.prismaService.savedJob.delete({ where: { id: savedJobId } });
  }

  private toDomain(savedJob: any): SavedJob {
    return new SavedJob({
      id: savedJob.id,
      userId: savedJob.userId,
      jobId: savedJob.jobId,
      savedAt: savedJob.savedAt,
    });
  }

  private toPersistence(savedJob: SavedJob): any {
    return {
      id: savedJob.id,
      userId: savedJob.userId,
      jobId: savedJob.jobId,
      savedAt: savedJob.savedAt,
    };
  }
}
