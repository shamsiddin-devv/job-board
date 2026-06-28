import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";


export interface ICompanyProps {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  city?: string;
  isVerified?: boolean;
  createdAt?: Date;
}

export class Company {
  private _isVerified: boolean;
  
  constructor(private props: ICompanyProps) {
    if(!props.name && props.name.trim() === '') {
      throw new BadRequestError('Name is required.'); 
    };

    if(!props.userId) {
      throw new BadRequestError('User id is required.')
    };

    if(props.website && !props.website.startsWith('http')) {
      throw new BadRequestError('Website must start with https://') 
    };

    this._isVerified = props.isVerified ?? false
  };

  verify(): void {
    if(this._isVerified) {
      throw new ConflictError('Company already verified.');
    };
    this._isVerified = true
  };

  unverified(): void {
    if(!this._isVerified) {
      throw new BadRequestError('Company is not verified.')
    };
    this._isVerified = false
  };

  canPostJob(): boolean {
    return this._isVerified;
  }

  get id() {return this.props.id}
  get userId() {return this.props.userId}
  get name() {return this.props.name}
  get description() {return this.props.description}
  get website() {return this.props.website}
  get logoUrl() {return this.props.logoUrl}
  get industry() {return this.props.industry}
  get size() {return this.props.size}
  get city() {return this.props.city}
  get isVerified() {return this.props.isVerified}
  get createdAt() {return this.props.createdAt}
};
