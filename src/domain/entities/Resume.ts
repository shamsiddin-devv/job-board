import { BadRequestError } from "../errors/BadRequestError"
import { ConflictError } from "../errors/ConflictError"
import { SalaryRange } from "../value-objects/Salary"

export type ResumeStatusType = 'active' | 'closed' | 'draft'

export interface IResumeProps {
  id?: string
  userId: string
  title: string
  summary?: string
  city?: string
  salaryRange?: SalaryRange
  fileUrl?: string
  status?: ResumeStatusType
  createdAt?: Date
};

export class Resume {
  private _status: ResumeStatusType

  constructor(private props: IResumeProps) {
    if(!props.title || props.title.trim() === '') {
      throw new BadRequestError('Title is required.');
    };

    if(!props.userId) {
      throw new BadRequestError('User id is required.')
    };

    this._status = props.status ?? 'active'
  };

  close(): void {
    if(this._status === 'closed') {
      throw new ConflictError('CV already closed.')
    };
    this._status = 'closed'
  };

  reopen(): void {
    if(this._status === 'active') {
      throw new ConflictError('CV already active.');
    };
    this._status = 'active'
  };

  draft(): void {
    if(this._status === 'draft') {
      throw new ConflictError('CV already draft.')
    };
    if(this._status === 'closed') {
      throw new BadRequestError('Closed CV cannot be drafted.')
    };
    this._status = 'draft'
  };

  attachFile(url: string): void {
    if(!url && url.trim() === '') {
      throw new BadRequestError('File URL is required.');
    };
    this.props.fileUrl = url;
  };

  isActive(): boolean {return this._status === 'active'};
  
  get id() {return this.props.id}
  get userId() {return this.props.userId}
  get title() {return this.props.title}
  get summary() {return this.props.summary}
  get city() {return this.props.city}
  get salaryRange() {return this.props.salaryRange}
  get fileUrl() {return this.props.fileUrl}
  get status() {return this._status}
  get createdAt() {return this.props.createdAt}
};