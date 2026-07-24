import { JobType, PostType, WorkFormat } from "src/domain/entities/Job";

export class PostJobDto {
  title: string;
  description: string;
  postType: PostType;
  jobType: JobType;
  workFormat: WorkFormat;
  city: string;
  salaryMin?:  number;
  salaryMax?:  number;
  currency: 'UZS' | 'USD';
};