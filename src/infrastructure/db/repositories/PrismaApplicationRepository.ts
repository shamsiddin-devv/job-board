import { Injectable } from "@nestjs/common";
import { IApplicationRepository } from "src/domain/repositories/IApplicationRepository";
import { PrismaService } from "../prisma.service";
import { Application } from "src/domain/entities/Application";


@Injectable()
export class PrismaApplicationRepository implements IApplicationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(applicationId: string): Promise<Application | null> {
    const application = await this.prismaService.application.findUnique({where: {id: applicationId}});
    if(!application) return null;
    return this.toDomain(application);
  };

  async findByJobApplicant(jobId: string, applicantId: string): Promise<Application | null> {
    const job = await this.prismaService.application.findUnique({where: {jobId_applicantId: {jobId, applicantId}}});
    if(!job) return null
    return this.toDomain(job);
  };

  async findAll(): Promise<Application[]> {
    const applications = await this.prismaService.application.findMany();
    return applications.map((application) => this.toDomain(application));
  };

  async save(data: Application): Promise<Application> {
    const application = await this.prismaService.application.upsert({
      where: {id: data.id ?? ''},
      update: this.toPersistance(data),
      create: this.toPersistance(data)
    });
    return this.toDomain(application);
  };

  async remove(applicationId: string): Promise<void> {
    await this.findById(applicationId),
    await this.prismaService.application.delete({where: {id: applicationId}});
  };

  private toDomain(application: any): Application {
    return new Application({
      id: application.id,
      jobId: application.jobId,
      applicantId: application.applicantId,
      coverLetter: application.coverLetter ?? '',
      resumeUrl: application.resumeUrl,
      status: application.status,
      appliedAt: application.appliedAt
    });
  };

  private toPersistance(application: Application): any {
    return {
      id: application.id,
      jobId: application.jobId,
      applicantId: application.applicantId,
      coverLetter: application.coverLetter,
      resumeUrl: application.resumeUrl,
      status: application.status,
      appliedAt: application.appliedAt
    };
  };
};