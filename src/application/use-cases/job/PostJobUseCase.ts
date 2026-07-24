import { PostJobDto } from 'src/application/dto/job/PostJobDto';
import { JOB_MESSAGES } from 'src/domain/constants/message';
import { Job } from 'src/domain/entities/Job';
import { ForbiddenError } from 'src/domain/errors/ForbiddenError';
import { NotFoundError } from 'src/domain/errors/NotFoundError';
import { ICompanyRepository } from 'src/domain/repositories/ICompanyRepository';
import { IJobRepository } from 'src/domain/repositories/IJobRespository';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { SalaryRange } from 'src/domain/value-objects/Salary';

export class PostJobUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly jobRepo: IJobRepository,
  ) {}

  async execute(dto: PostJobDto) {
    const user = await this.userRepo.findById(dto.userId);
    if (!user) throw new NotFoundError(JOB_MESSAGES.USER_NOT_FOUND);

    if (dto.postType === 'job') {
      if (!user.isCompany()) {
        throw new ForbiddenError(JOB_MESSAGES.ONLY_COMPANIES_CAN_POST_JOBS);
      }

      const company = await this.companyRepo.findByUserId(user.id!);
      if (!company?.isVerified) {
        throw new ForbiddenError(JOB_MESSAGES.COMPANY_VERIFICATION_REQUIRED);
      }
    }

    if (dto.postType === 'resume') {
      if (!user.isWorker()) {
        throw new ForbiddenError(JOB_MESSAGES.ONLY_WORKERS_CAN_POST_RESUMES);
      }
    }

    const salaryRange =
      dto.salaryMin || dto.salaryMax
        ? new SalaryRange({
            min: dto.salaryMin,
            max: dto.salaryMax,
            currency: dto.currency,
          })
        : undefined;
          
    const newJob = new Job({
      userId: user.id!,
      title: dto.title,
      postType: dto.postType,
      jobType: dto.jobType,
      workFormat: dto.workFormat,
      salaryRange
    });

    await this.jobRepo.create(newJob);
  }
}
