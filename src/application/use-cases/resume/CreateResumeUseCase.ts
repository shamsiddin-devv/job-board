import { CreateResumeDto } from 'src/application/dto/resume/CreateResumeDto';
import { Resume } from 'src/domain/entities/Resume';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { UnauthorizedError } from 'src/domain/errors/UnauthorizedError';
import { IResumeRepository } from 'src/domain/repositories/IResumeRepository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { SalaryRange } from 'src/domain/value-objects/Salary';

export class CreateResumeUseCase {
  constructor(
    private readonly resumeRepo: IResumeRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string, dto: CreateResumeDto) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('Foydalanuvchi');
    if (!user.isWorker())
      throw new UnauthorizedError('Faqat workerlar CV yarata oladi');

    const existing = await this.resumeRepo.findByUserId(userId);
    if (existing) throw new ConflictError('CV allaqachon mavjud');

    const salaryRange =
      dto.salaryMin || dto.salaryMax
        ? new SalaryRange({
            min: dto.salaryMin,
            max: dto.salaryMax,
            currency: dto.currency,
          })
        : undefined;

    const resume = new Resume({
      userId,
      title: dto.title,
      summary: dto.summary,
      city: dto.city,
      salaryRange
    });

    return await this.resumeRepo.create(resume);
  }
}
