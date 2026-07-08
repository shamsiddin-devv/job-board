import { Company } from "../entities/Company";

export interface ICompanyRepository {
  findById(companyId: string): Promise<Company | void>
  findByUserId(userId: string): Promise<Company>
  findAll(): Promise<Company[]>
  save(data: Company): Promise<Company>
  remove(companyId: string): Promise<void>
};