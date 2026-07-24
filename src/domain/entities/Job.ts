import { JOB_MESSAGES } from "../constants/message";
import { BadRequestError } from "../errors/BadRequestError";
import { SalaryRange } from "../value-objects/Salary";

export type JobStatus = 'active' | 'closed' | 'draft';
export type PostType = 'job' | 'resume';
export type JobType = 'full_time' | 'part_time' | 'freelance' | 'internship';
export type WorkFormat = 'remote' | 'onsite' | 'hybrid'
export type CurrencyType = 'UZS' | 'USD'

export interface IJobProps {
  id?: string
  userId: string
  title: string
  description?: string
  postType: PostType
  jobType: JobType
  workFormat: WorkFormat
  city?: string
  salaryRange?: SalaryRange
  status?: JobStatus
  viewsCount?: number
  createdAt?: Date 
}

export class Job {
  private _status: JobStatus
  private _viewsCount: number

  constructor(private props: IJobProps) {
    if(!props.title && props.title.trim() === '') {
      throw new BadRequestError(JOB_MESSAGES.TITLE_REQUIRED);
    };

    if(!props.userId) {
      throw new BadRequestError(JOB_MESSAGES.USER_ID_REQUIRED);
    };

    this._status = props.status ?? 'active';
    this._viewsCount = props.viewsCount ?? 0
  };

  closed(): void {
    if(this._status === 'closed') {
      throw new BadRequestError(JOB_MESSAGES.JOB_ALREADY_CLOSED);
    };
    this._status = 'closed'
  };

  draft(): void {
    if(this._status === 'closed') {
      throw new BadRequestError(JOB_MESSAGES.CLOSED_CANNOT_BE_DRAFTED);
    };
    this._status = 'draft'
  };

  publish(): void {
    if(this._status === 'closed') {
      throw new BadRequestError(JOB_MESSAGES.CLOSED_CANNOT_BE_REPUBLISHED); 
    };
    this._status = 'active'
  };

  incrementViews(): void {
    this._viewsCount += 1
  };

  get id() {return this.props.id};
  get userId() {return this.props.userId}
  get title() {return this.props.title}
  get description() {return this.props.description}
  get postType() {return this.props.postType}
  get jobType() {return this.props.jobType}
  get workFormat() {return this.props.workFormat}
  get city() {return this.props.city}
  get salaryRange() {return this.props.salaryRange}
  get status() {return this._status}
  get viewsCount() {return this._viewsCount}
  get createdAt() {return this.props.createdAt}
};