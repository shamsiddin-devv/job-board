import { NOTIFICATION_MESSAGES } from "../constants/message";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";

export type NotificationType = 'application_accepted' | 'new_applicant' | 'job_expiring'

export interface INotificationProps {
  id?: string;
  userId: string;
  message: string;
  type?: NotificationType;
  isRead?: boolean;
  createdAt: Date;
};

export class Notification {
  private _isRead: boolean

  constructor(private props: INotificationProps) {
    if(!props.userId) {
      throw new BadRequestError(NOTIFICATION_MESSAGES.USER_ID_REQUIRED);
    };

    if(!props.message && props.message.trim() === '') {
      throw new BadRequestError(NOTIFICATION_MESSAGES.MESSAGE_REQUIRED);
    };

    this._isRead = this.props.isRead ?? false;
  };

  markAsRead(): void {
    if(this._isRead) {
      throw new ConflictError(NOTIFICATION_MESSAGES.NOTIFICATION_ALREADY_READ);
    }
    this._isRead = true;
  };

  get id() {return this.props.id}
  get userId() {return this.props.userId}
  get message() {return this.props.message}
  get type() {return this.props.type}
  get isRead() {return this.props.isRead}
  get created() {return this.props.createdAt}
};