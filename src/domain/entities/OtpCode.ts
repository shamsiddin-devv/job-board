import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export type OtpType = 'email_verify' | 'reset_password'

export interface IOtpCodeProps {
  id?: string;
  userId: string;
  code: number;
  type?: OtpType;
  expiresAt?: Date;
  isUsed?: boolean;
  createdAt?: Date;
};

export class OtpCode {
  private _isUsed: boolean

  constructor(private props: IOtpCodeProps) {
    if(!props.userId) {
      throw new BadRequestError('User id is required.');
    };

    if(!props.code && !Number(props.code)) {
      throw new UnauthorizedError('Invalid OTP code.');
    };

    this._isUsed = this.props.isUsed ?? false;
  };

  isExpired(): boolean {
    return new Date > this.props.expiresAt!;
  };

  isValid(): boolean {
    return !this.isExpired() && !this.props.isUsed
  };

  markAsUsed(): void {
    if(!this.isExpired()) {
      throw new UnauthorizedError('OTP has expired.')
    };
    this._isUsed = true
  };
}