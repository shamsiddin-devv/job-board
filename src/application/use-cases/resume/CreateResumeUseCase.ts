import { CreateResumeDto } from 'src/application/dto/resume/CreateResumeDto';
import { RESUME_MESSAGES, USER_MESSAGES } from 'src/domain/constants/message';
import { Resume } from 'src/domain/entities/Resume';
import { ConflictError } from 'src/domain/errors/ConflictError';
import { ForbiddenError } from 'src/domain/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
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
    if (!user) throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    if (!user.isWorker())
      throw new ForbiddenError(RESUME_MESSAGES.ONLY_WORKER_CAN_CREATE_RESUME);

    const existing = await this.resumeRepo.findByUserId(userId);
    if (existing) throw new ConflictError(RESUME_MESSAGES.RESUME_ALREADY_EXIST);

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
