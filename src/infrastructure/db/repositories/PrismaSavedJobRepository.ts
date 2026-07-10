import { Injectable } from "@nestjs/common";
import { ISavedJobRepository } from "src/domain/repositories/ISavedJobRepository";
import { PrismaService } from "../prisma.service";
import { SavedJob } from "src/domain/entities/SavedJob";


@Injectable()
export class PrismaSavedJobRepository implements ISavedJobRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(savedJobId: string): Promise<SavedJob | null> {
    const savedJob = await this.prismaService.savedJob.findUnique({where: {id: savedJobId}});
    if(!savedJob) return null;
    return this.toDomain(savedJob);
  };

  async findByUserId(userId: string): Promise<SavedJob[]> {
    const savedJobs = await this.prismaService.savedJob.findMany({where: {userId}});
    return savedJobs.map((savedJob) => this.toDomain(savedJob));
  } 

  async findByUserAndJob(userId: string, jobId: string): Promise<SavedJob | null> {
    const savedJob = await this.prismaService.savedJob.findUnique({where: {userId_jobId: {userId, jobId}}});
    if(!savedJob) return null;
    return this.toDomain(savedJob);
  };

  async findAll(): Promise<SavedJob[]> {
    const savedJobs = await this.prismaService.savedJob.findMany();
    return savedJobs.map((savedJob) => this.toDomain(savedJob));
  };

  async save(data: SavedJob): Promise<SavedJob> {
    const row = await this.prismaService.savedJob.upsert({
      where: {id: data.id ?? ''},
      update: this.toPersistance(data),
      create: this.toPersistance(data)
    });
    return this.toDomain(row);
  };

  async remove(savedJobId: string): Promise<void> {
    await this.findById(savedJobId);
    await this.prismaService.savedJob.delete({where: {id: savedJobId}});
  };

  private toDomain(savedJob: any): SavedJob {
    return new SavedJob({
      id: savedJob.id,
      userId: savedJob.userId,
      jobId: savedJob.jobId,
      savedAt: savedJob.savedAt
    });
  };

  private toPersistance(savedJob: SavedJob): any {
    return {
      id: savedJob.id,
      userId: savedJob.userId,
      jobId: savedJob.jobId,
      savedAt: savedJob.savedAt
    };
  };
};