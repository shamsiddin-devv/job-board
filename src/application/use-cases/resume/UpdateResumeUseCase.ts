import { CreateResumeDto } from 'src/application/dto/resume/CreateResumeDto';
import { RESUME_MESSAGES } from 'src/domain/constants/message';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { IResumeRepository } from 'src/domain/repositories/IResumeRepository';
import { SalaryRange } from 'src/domain/value-objects/Salary';

export class UpdateResumeUseCase {
  constructor(private readonly resumeRepo: IResumeRepository) {}

  async execute(userId: string, dto: Partial<CreateResumeDto>) {
    const resume = await this.resumeRepo.findByUserId(userId);
    if (!resume) throw new NotFoundError(RESUME_MESSAGES.RESUME_NOT_FOUND);

    const salaryRange =
      (dto.salaryMin != null || (dto.currency != null && resume.salaryRange))
        ? new SalaryRange({
            min: dto.salaryMin ?? resume.salaryRange?.min,
            currency: dto.currency ?? resume.salaryRange?.currency ?? 'UZS',
          })
        : undefined;

    resume.update({
      title: dto.title,
      summary: dto.summary,
      city: dto.city,
      salaryRange,
    });

    return await this.resumeRepo.update(resume.id!, resume);
  }
}
