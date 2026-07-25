import { CreateCompanyDto } from "src/application/dto/company/CreateCompanyDto"
import { COMPANY_MESSAGES, USER_MESSAGES } from "src/domain/constants/message"
import { Company } from "src/domain/entities/Company"
import { ConflictError } from "src/domain/errors/ConflictError"
import { ForbiddenError } from "src/domain/errors/ForbiddenError"
import { NotFoundError } from "src/domain/errors/NotFoundError"
import { ICompanyRepository } from "src/domain/repositories/ICompanyRepository"
import { IUserRepository } from "src/domain/repositories/IUserRepository"
 
export class CreateCompanyProfileUseCase {
  constructor(
    private readonly companyRepo: ICompanyRepository,
    private readonly userRepo: IUserRepository,
  ) {}
 
  async execute(userId: string, dto: CreateCompanyDto) {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    if (!user.isCompany())
      throw new ForbiddenError(COMPANY_MESSAGES.ONLY_CAN_CREATE_COMPANY);
 
    const existing = await this.companyRepo.findByUserId(userId)
    if (existing) throw new ConflictError(COMPANY_MESSAGES.COMPANY_PROFILE_ALREADY_EXIST)
 
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