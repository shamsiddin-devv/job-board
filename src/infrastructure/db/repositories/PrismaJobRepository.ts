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
    const userJobs = await this.prismaService.job.findMany({where: {userId}});
    return userJobs.map((job) => this.toDomain(job));
  };
  
  async findAll(): Promise<Job[]> {
    const jobs = await this.prismaService.job.findMany();
    return jobs.map((job) => this.toDomain(job));
  }

  async create(data: Job): Promise<Job> {
    const row = await this.prismaService.job.create({
      data: this.toPersistence(data)
    });
    return this.toDomain(row)
  };

  async update(jobId: string, data: Job): Promise<Job> {
    const row = await this.prismaService.job.update({
      where: {id: jobId},
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  };

  async remove(jobId: string): Promise<void> {
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

  private toPersistence(job: Job): any {
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
