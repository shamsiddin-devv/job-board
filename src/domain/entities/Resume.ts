import { RESUME_MESSAGES } from "../constants/message"
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
      throw new BadRequestError(RESUME_MESSAGES.TITLE_REQUIRED);
    };

    if(!props.userId) {
      throw new BadRequestError(RESUME_MESSAGES.USER_ID_REQUIRED);
    };

    this._status = props.status ?? 'active'
  };

  close(): void {
    if(this._status === 'closed') {
      throw new ConflictError(RESUME_MESSAGES.RESUME_ALREADY_CLOSED);
    };
    this._status = 'closed'
  };

  reopen(): void {
    if(this._status === 'active') {
      throw new ConflictError(RESUME_MESSAGES.RESUME_ALREADY_ACTIVE);
    };
    this._status = 'active'
  };

  draft(): void {
    if(this._status === 'draft') {
      throw new ConflictError(RESUME_MESSAGES.RESUME_ALREADY_DRAFT);
    };
    if(this._status === 'closed') {
      throw new BadRequestError(RESUME_MESSAGES.CLOSED_RESUME_CANNOT_BE_DRAFTED)
    };
    this._status = 'draft'
  };

  attachFile(url: string): void {
    if(!url && url.trim() === '') {
      throw new BadRequestError(RESUME_MESSAGES.FILE_URL_REQUIRED);
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