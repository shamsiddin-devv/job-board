import { BadRequestError } from "../errors/BadRequestError"
import { ConflictError } from "../errors/ConflictError"

export type IApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected' 

export interface IApplicationProps {
  id?: string
  jobId: string
  applicantId: string
  coverLetter?: string
  resumeUrl?: string
  status?: IApplicationStatus
  appliedAt?: Date
}

export class Application {
  private _status: IApplicationStatus

  constructor(private props: IApplicationProps) {
    if(!props.jobId) {
      throw new BadRequestError('Job id is required.');
    };

    if(!props.applicantId) {
      throw new BadRequestError('Applicant id is required.')
    };

    this._status = props.status ?? 'pending'
  };

  markAsReviewed(): void {
    if(this._status !== 'pending') {
      throw new BadRequestError('Only pending applications can be reviewed.') 
    };
    this._status = 'reviewed'
  };

  accept(): void {
    if(this._status === 'accepted') {
      throw new ConflictError('Application already accepted.')
    };
    if(this._status === 'rejected') {
      throw new BadRequestError('Rejected application cannot be accepted.')
    };
    this._status = 'accepted'
  };

  reject(): void {
    if(this._status === 'rejected') {
      throw new ConflictError('Application already rejected.')
    };
    if(this._status === 'accepted') {
      throw new BadRequestError('Accepted application cannot be rejected.')
    };
    this._status = 'rejected'
  };

  isPending(): boolean {return this._status === 'pending'};
  isAccepted(): boolean {return this._status === 'accepted'};
  isRejected(): boolean {return this._status === 'rejected'};
  
  get id() {return this.props.id};
  get jobId() {return this.props.jobId};
  get applicantId() {return this.props.applicantId};
  get coverLetter() {return this.props.coverLetter};
  get resumeUrl() {return this.props.resumeUrl};
  get status() {return this._status};
  get appliedAt() {return this.props.appliedAt};
};