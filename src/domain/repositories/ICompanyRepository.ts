import { Company } from "../entities/Company";

export interface ICompanyRepository {
  findById(uuid: string): Promise<Company | void>
  findByUserId(uuid: string): Promise<Company>
  findAll(): Promise<Company[]>
  save(company: Company): Promise<Company>
  delete(uuid: string): Promise<void>
};