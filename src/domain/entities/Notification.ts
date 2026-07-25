export type NotificationType =
  | 'application_accepted'
  | 'application_rejected'
  | 'new_applicant'
  | 'job_expiring'
  | 'company_verified'

export interface NotificationProps {
  id?: string
  userId: string
  type: NotificationType
  message: string
  isRead?: boolean
  createdAt?: Date
}

export class Notification {
  private _isRead: boolean

  constructor(private props: NotificationProps) {
    if (!props.userId) throw new Error('User ID bo\'lishi shart')
    if (!props.message || props.message.trim() === '')
      throw new Error('Xabar matni bo\'lishi shart')

    this._isRead = props.isRead ?? false
  }

  markAsRead(): void {
    if (this._isRead) throw new Error('Allaqachon o\'qilgan')
    this._isRead = true
  }

  get id() { return this.props.id }
  get userId() { return this.props.userId }
  get type() { return this.props.type }
  get message() { return this.props.message }
  get isRead() { return this._isRead }
  get createdAt() { return this.props.createdAt }
}