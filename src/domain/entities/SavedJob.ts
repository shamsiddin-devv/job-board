import { SAVED_JOB_MESSAGES } from '../constants/message';
import { BadRequestError } from '../errors/BadRequestError';

export interface ISavedJobProps {
  id?: string;
  userId: string;
  jobId: string;
  savedAt?: Date;
}

export class SavedJob {
  constructor(private props: ISavedJobProps) {
    if (!props.userId) {
      throw new BadRequestError(SAVED_JOB_MESSAGES.USER_ID_REQUIRED);
    };
    if(!props.jobId) {
      throw new BadRequestError(SAVED_JOB_MESSAGES.JOB_ID_REQUIRED);
    };
  };

  get id() {return this.props.id};
  get userId() {return this.props.userId};
  get jobId() {return this.props.jobId};
  get savedAt() {return this.props.savedAt};
};
