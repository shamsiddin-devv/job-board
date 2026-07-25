import { AUTH_MESSAGES, USER_MESSAGES } from '../constants/message';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';
import { Email } from '../value-objects/Email';

export type UserRoles = 'company' | 'worker' | 'admin';
export type AuthProvider = 'local' | 'google' | 'github'

export interface IUserProps {
  id?: string;
  email: Email;
  fullName: string;
  phone?: string;
  role: UserRoles;
  avatarUrl?: string;
  authProvider?: AuthProvider;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
}

export class User {
  private _isVerified: boolean;
  private _isActive: boolean;
  private _authProvider: AuthProvider;

  constructor(private props: IUserProps) {
    if (!props.fullName || props.fullName.trim() === '') {
      throw new BadRequestError(USER_MESSAGES.FULL_NAME_REQUIRED);
    };

    const validateRoles: UserRoles[] = ['company', 'worker', 'admin'];
    if (!validateRoles.includes(props.role)) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_ROLE)
    };

    this._isVerified = props.isVerified ?? false
    this._isActive = props.isActive ?? true
    this._authProvider = props.authProvider ?? 'local';
  }
  
  markAsVerified(): void {
    if(this._isVerified) {
      throw new ConflictError(USER_MESSAGES.ALREADY_APPROVED)
    }
    this._isVerified = true
  };

  deactive(): void {
    if(!this._isActive) {
      throw new ConflictError(USER_MESSAGES.ALREADY_INACTIVE)
    };
    this._isVerified = false
  };

  isOAuthUser(): boolean {
    return this._authProvider !== 'local'
  };

  activate(): void {
    if(this._isActive) {
      throw new ConflictError(USER_MESSAGES.ALREADY_ACTIVE)
    };
    this._isActive = true
  };

  isCompany(): boolean {return this.props.role === 'company'}
  isWorker(): boolean {return this.props.role === 'worker'}
  isAdmin(): boolean {return this.props.role === 'admin'}

  get id() {return this.props.id}
  get email() {return this.props.email}
  get fullName() {return this.props.fullName}
  get phone() {return this.props.phone}
  get role() {return this.props.role}
  get avatarUrl() {return this.props.avatarUrl}
  get authProvider() { return this._authProvider }
  get isVerified() {return this._isVerified}
  get isActive() {return this._isActive}
  get createdAt() {return this.props.createdAt}
};
