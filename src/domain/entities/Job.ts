import { SalaryRange } from "../value-objects/Salary";

export type JobStatus = 'active' | 'closed' | 'draft';
export type PostType = 'job' | 'resume';
export type JobType = 'full_time' | 'part_time' | 'freelance' | 'internship';
export type WorkFormat = 'remote' | 'onsite' | 'hybrid'
export type CurrencyType = 'UZS' | 'USD'

export interface IJobProps {
  id?: string
  user_id: string
  title: string
  description?: string
  postType: PostType
  jobType: JobType
  workFormat: WorkFormat
  city?: string
  salaryRange?: SalaryRange
  status?: JobStatus
  viewsCount: number
  createdAt: Date 
}

export class Job {
  private _status: JobStatus
  private _viewCount: number

  constructor(private prop: IJobProps) {
    
  };
};