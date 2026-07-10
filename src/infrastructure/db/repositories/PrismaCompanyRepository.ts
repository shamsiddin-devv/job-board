import { Injectable } from "@nestjs/common";
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository";
import { PrismaService } from "../prisma.service";
import { Company } from "src/domain/entities/Company";


@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}
  
  async findById(companyId: string): Promise<Company | null> {
    const company = await this.prismaService.company.findUnique({where: {id: companyId}});
    if(!company) return null
    return this.toDomain(company);
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const user = await this.prismaService.company.findUnique({where: {userId}});
    if(!user) return null
    return this.toDomain(user);
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.prismaService.company.findMany();
    return companies.map((company) => this.toDomain(company));
  };

  async save(data: Company): Promise<Company> {
    const row = await this.prismaService.company.upsert({
      where: {id: data.id ?? ''},
      update: this.toPersistance(data),
      create: this.toPersistance(data)
    });
    return this.toDomain(row);
  };

  async remove(companyId: string): Promise<void> {
    await this.findById(companyId);
    await this.prismaService.company.delete({where: {id: companyId}});
  };

  private toDomain(company: any): Company {
    return new Company({
      id: company.id,
      userId: company.userId,
      name: company.name,
      description: company.description,
      website: company.website,
      logoUrl: company.logoUrl,
      industry: company.industry,
      size: company.size,
      city: company.city,
      isVerified: company.isVerified,
      createdAt: company.createdAt
    });
  };

  private toPersistance(company: Company): any {
    return {
      id: company.id,
      userId: company.userId,
      name: company.name,
      description: company.description,
      website: company.website,
      logoUrl: company.logoUrl,
      industry: company.industry,
      size: company.size,
      city: company.city,
      isVerified: company.isVerified,
      createdAt: company.createdAt
    }
  }
}