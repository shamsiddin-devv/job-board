import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';
import { Email } from '../value-objects/Email';

export type UserRoles = 'company' | 'worker' | 'admin';

export interface IUserProps {
  id?: string;
  email: Email;
  name: string;
  phone?: string;
  role: UserRoles;
  avatarUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
}

export class User {
  private _isVerified: boolean;
  private _isActive: boolean;

  constructor(private props: IUserProps) {
    if (!props.name || props.name.trim() === '') {
      throw new BadRequestError('Name is required.');
    };

    const validateRoles: UserRoles[] = ['company', 'worker', 'admin'];
    if (!validateRoles.includes(props.role)) {
      throw new BadRequestError('Invalid role.')
    };

    this._isVerified = props.isVerified ?? false
    this._isActive = props.isActive ?? true
  }
  
  markAsVerified(): void {
    if(this._isVerified) {
      throw new ConflictError('Already approverd.')
    }
    this._isVerified = true
  };

  deactive(): void {
    if(!this._isActive) {
      throw new ConflictError('Already blocked.')
    };
    this._isVerified = false
  };

  activate(): void {
    if(this._isActive) {
      throw new ConflictError('Already active.')
    };
    this._isActive = true
  };

  isCompany(): boolean {return this.props.role === 'company'}
  isWorker(): boolean {return this.props.role === 'worker'}
  isAdmin(): boolean {return this.props.role === 'admin'}

  get id() {return this.props.id}
  get email() {return this.props.email}
  get name() {return this.props.name}
  get phone() {return this.props.phone}
  get role() {return this.props.role}
  get avatarUrl() {return this.props.avatarUrl}
  get isVerified() {return this._isVerified}
  get isAvtive() {return this._isActive}
  get createdAt() {return this.props.createdAt}
};
