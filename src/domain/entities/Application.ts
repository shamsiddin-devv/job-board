import { APPLICATION_MESSAGES } from "../constants/message"
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
      throw new BadRequestError(APPLICATION_MESSAGES.JOB_ID_REQUIRED);
    };

    if(!props.applicantId) {
      throw new BadRequestError(APPLICATION_MESSAGES.APPLICANT_ID_REQUIRED);
    };

    this._status = props.status ?? 'pending'
  };

  markAsReviewed(): void {
    if(this._status !== 'pending') {
      throw new BadRequestError(APPLICATION_MESSAGES.ONLY_PENDING_CAN_BE_REVIEWED) 
    };
    this._status = 'reviewed'
  };

  accept(): void {
    if(this._status === 'accepted') {
      throw new ConflictError(APPLICATION_MESSAGES.APPLICATION_ALREADY_ACCEPTED);
    };
    if(this._status === 'rejected') {
      throw new BadRequestError(APPLICATION_MESSAGES.REJECTED_CANNOT_BE_ACCEPTED);
    };
    this._status = 'accepted'
  };

  reject(): void {
    if(this._status === 'rejected') {
      throw new ConflictError(APPLICATION_MESSAGES.APPLICATION_ALREADY_REJECTED);
    };
    if(this._status === 'accepted') {
      throw new BadRequestError(APPLICATION_MESSAGES.ACCEPTED_CANNOT_BE_REJECTED)
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