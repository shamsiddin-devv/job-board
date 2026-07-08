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
      throw new BadRequestError('User id is required.');
    };
    if(!props.jobId) {
      throw new BadRequestError('Job id is reuqired.');
    };
  };

  get id() {return this.props.id};
  get userId() {return this.props.userId};
  get jobId() {return this.props.jobId};
  get savedAt() {return this.props.savedAt};
};
