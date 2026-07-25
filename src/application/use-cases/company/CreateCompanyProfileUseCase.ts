import { Company } from "src/domain/entities/Company"
import { ConflictError } from "src/domain/errors/ConflictError"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { UnauthorizedError } from "src/domain/errors/UnauthorizedError"
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository"
import { IUserRepository } from "src/domain/repositories/IUserRepository"

export interface CreateCompanyDto {
  name: string
  description?: string
  website?: string
  industry?: string
  size?: string
  city?: string
}
 
export class CreateCompanyProfileUseCase {
  constructor(
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}
 
  async execute(userId: string, dto: CreateCompanyDto) {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new NotFoundError('Foydalanuvchi')
    if (!user.isCompany())
      throw new UnauthorizedError('Faqat company rolidagi userlar profil yaratadi')
 
    const existing = await this.companyRepo.findByUserId(userId)
    if (existing) throw new ConflictError('Kompaniya profili allaqachon mavjud')
 
    const company = new Company({
      userId,
      name: dto.name,
      description: dto.description,
      website: dto.website,
      industry: dto.industry,
      size: dto.size,
      city: dto.city,
    })
 
    return await this.companyRepo.create(company)
  }
}