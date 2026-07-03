import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export interface IRefreshTokenProps {
  id?: string;
  userId: string;
  token: string
  expiresAt?: Date
  isRevoked?: boolean;
  createdAt?: Date
};

export class RefreshToken {
  private _isRevoked: boolean

  constructor(private props: IRefreshTokenProps) {
    if(!props.userId) {
      throw new BadRequestError('User Id is required.');
    };

    if(!props.token && props.token.trim() === '') {
      throw new BadRequestError('Token is required.')
    };

    this._isRevoked = this.props.isRevoked ?? false
  };

  revoke(): void {
    if(this._isRevoked) {
      throw new UnauthorizedError('Invalid refresh token.')
    };
    this._isRevoked = true
  };

  get id() {return this.props.id}
  get userId() {return this.props.userId}
  get token() {return this.props.token}
  get expiresAt() {return this.props.expiresAt}
  get isRevoked() {return this._isRevoked}
  get createdAt() {return this.props.createdAt}
}
