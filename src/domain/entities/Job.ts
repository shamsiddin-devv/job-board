import { BadRequestError } from "../errors/BadRequestError";
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
  private _viewsCount: number

  constructor(private props: IJobProps) {
    if(!props.title && props.title.trim() === '') {
      throw new BadRequestError('Title is required.')
    };

    if(!props.user_id) {
      throw new BadRequestError('User id is required.')
    };

    this._status = props.status ?? 'active';
    this._viewsCount = props.viewsCount ?? 0
  };

  closed(): void {
    if(this._status === 'closed') {
      throw new BadRequestError('Vacancy is already closed.')
    };
    this._status = 'closed'
  };

  draft(): void {
    if(this._status === 'closed') {
      throw new BadRequestError('A closed vacancy cannot be moved to a draft.')
    };
    this._status = 'draft'
  };

  publish(): void {
    if(this._status === 'closed') {
      throw new BadRequestError('A closed vacancy cannot be republished.')
    };
    this._status = 'active'
  };

  incrementViews(): void {
    this._viewsCount += 1
  };

  get id() {return this.props.id};
  get user_id() {return this.props.user_id}
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