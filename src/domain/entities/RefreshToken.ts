import { REFRESH_TOKEN_MESSAGES } from "../constants/message";
import { BadRequestError } from "../errors/BadRequestError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export interface IRefreshTokenProps {
  id?: string;
  userId: string;
  token: string
  expiresAt: Date
  isRevoked?: boolean;
  createdAt?: Date
};

export class RefreshToken {
  private _isRevoked: boolean

  constructor(private props: IRefreshTokenProps) {
    if(!props.userId) {
      throw new BadRequestError(REFRESH_TOKEN_MESSAGES.USER_ID_REQUIRED);
    };

    if(!props.token && props.token.trim() === '') {
      throw new BadRequestError(REFRESH_TOKEN_MESSAGES.TOKEN_REQUIRED);
    };

    this._isRevoked = this.props.isRevoked ?? false
  };

  isExpired(): boolean {
    return new Date() > this.props.expiresAt!
  };

  isValid(): boolean {
    return !this.isExpired() && !this._isRevoked
  };

  revoke(): void {
    if(this._isRevoked) {
      throw new UnauthorizedError(REFRESH_TOKEN_MESSAGES.TOKEN_REVOKED);
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
