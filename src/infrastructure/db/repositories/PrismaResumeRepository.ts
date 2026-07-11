import { Injectable } from "@nestjs/common";
import { IResumeRepository } from "src/domain/repositories/IResumeRepository";
import { PrismaService } from "../prisma.service";
import { Resume } from "src/domain/entities/Resume";


@Injectable()
export class PrismaResumeRepository implements IResumeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(resumeId: string): Promise<Resume | null> {
    const resume = await this.prismaService.resume.findUnique({where: {id: resumeId}});
    if(!resume) return null;
    return this.toDomain(resume);
  };

  async findByUserId(userId: string): Promise<Resume | null> {
    const userResume = await this.prismaService.resume.findFirst({where: {userId}});
    if(!userResume) return null
    return this.toDomain(userResume);
  };

  async findAll(): Promise<Resume[]> {
    const resumes = await this.prismaService.resume.findMany();
    return resumes.map((resume) => this.toDomain(resume));
  };

  async create(data: Resume): Promise<Resume> {
    const row = await this.prismaService.resume.create({
      data: this.toPersistence(data)
    });
    return this.toDomain(row);
  };

  async update(resumeId: string, data: Resume): Promise<Resume> {
    const row = await this.prismaService.resume.update({
      where: {id: resumeId},
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  };

  async remove(resumeId: string): Promise<void> {
    await this.prismaService.resume.delete({where: {id: resumeId}});
  };

  private toDomain(resume: any): Resume {
    return new Resume({
      id: resume.id,
      userId: resume.userId,
      title: resume.title,
      summary: resume.summary,
      city: resume.city,
      salaryRange: resume.salaryRange,
      fileUrl: resume.fileUrl,
      status: resume.status,
      createdAt: resume.createdAt
    });
  };

  private toPersistence(resume: Resume): any {
    return {
      id: resume.id,
      userId: resume.userId,
      ttile: resume.title,
      summary: resume.summary,
      city: resume.city,
      salaryRange: resume.salaryRange,
      fileUrl: resume.fileUrl,
      status: resume.status,
      createdAt: resume.createdAt
    };
  };
}