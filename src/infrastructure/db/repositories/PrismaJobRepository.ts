import { Injectable } from '@nestjs/common';
import { IJobRepository } from 'src/domain/repositories/IJobRespository';
import { PrismaService } from '../prisma.service';
import { Job } from 'src/domain/entities/Job';
import { SalaryRange } from 'src/domain/value-objects/Salary';

@Injectable()
export class PrismaJobRepository implements IJobRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(jobId: string): Promise<Job | null> {
    const job = await this.prismaService.job.findUnique({where: {id: jobId}});
    if(!job) return null;
    return this.toDomain(job);
  }

  async findAllByUserId(userId: string): Promise<Job[] | null> {
    const jobs = await this.prismaService.job.findMany({where: {userId}});
    return jobs.map((job) => this.toDomain(job));
  };
  
  async findAll(): Promise<Job[]> {
    const jobs = await this.prismaService.job.findMany();
    return jobs.map((job) => this.toDomain(job));
  }

  async save(data: Job): Promise<Job> {
    const row = await this.prismaService.job.upsert({
      where: {id: data.id},
      update: this.toPersistance(data),
      create: this.toPersistance(data)
    });
    return this.toDomain(row);
  };

  async remove(jobId: string): Promise<void> {
    await this.findById(jobId);
    await this.prismaService.job.delete({where: {id: jobId}});
  };

  private toDomain(job: any): Job {
    return new Job({
      id: job.id,
      userId: job.userId,
      title: job.title,
      description: job.description,
      postType: job.postType.toLowerCase(),
      jobType: job.jobType.toLowerCase(),
      workFormat: job.workFormat.toLowerCase(),
      city: job.city,
      salaryRange: new SalaryRange({
        currency: job.currency,
        min: job.min,
        max: job.max,
      }),
      status: job.status,
      viewsCount: job.viewsCount,
      createdAt: job.createdAt,
    });
  }

  private toPersistance(job: Job): any {
    return {
      id: job.id,
      userId: job.userId,
      title: job.title,
      description: job.description,
      postType: job.postType.toUpperCase(),
      jobType: job.jobType.toUpperCase(),
      workFormat: job.workFormat.toUpperCase(),
      city: job.city,
      salaryRange: job.salaryRange,
      status: job.status,
      viewsCount: job.viewsCount,
      createdAt: job.createdAt,
    };
  }
}
