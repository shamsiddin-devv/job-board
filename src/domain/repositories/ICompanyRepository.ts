import { Company } from "../entities/Company";

export interface ICompanyRepository {
  findById(companyId: string): Promise<Company | null>
  findByUserId(userId: string): Promise<Company | null>
  findAll(): Promise<Company[]>
  create(data: Company): Promise<Company>
  update(companyId: string, data: Company): Promise<Company>
  remove(companyId: string): Promise<void>
};