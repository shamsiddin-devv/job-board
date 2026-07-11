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
    const jobApplicant = await this.prismaService.application.findUnique({where: {jobId_applicantId: {jobId, applicantId}}});
    if(!jobApplicant) return null
    return this.toDomain(jobApplicant);
  };

  async findAll(): Promise<Application[]> {
    const applications = await this.prismaService.application.findMany();
    return applications.map((application) => this.toDomain(application));
  };

  async create(data: Application): Promise<Application> {
    const application = await this.prismaService.application.create({data: this.toPersistence(data)});
    return this.toDomain(application);
  };

  async update(applicationId: string, data: Application): Promise<Application> {
    const row = await this.prismaService.application.update({
      where: {id: applicationId},
      data: this.toPersistence(data)
    })
    return this.toDomain(row);
  };

  async remove(applicationId: string): Promise<void> {
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

  private toPersistence(application: Application): any {
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