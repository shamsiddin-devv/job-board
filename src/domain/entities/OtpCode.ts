import { OTP_MESSAGES } from "../constants/message";
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
      throw new BadRequestError(OTP_MESSAGES.USER_ID_REQUIRED);
    };

    if(!props.code && !Number(props.code)) {
      throw new UnauthorizedError(OTP_MESSAGES.OTP_INVALID);
    };

    this._isUsed = this.props.isUsed ?? false;
  };

  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
  };

  isExpired(): boolean {
    return new Date > this.props.expiresAt!;
  };

  isValid(): boolean {
    return !this.isExpired() && !this.props.isUsed
  };

  markAsUsed(): void {
    if(!this.isExpired()) {
      throw new UnauthorizedError(OTP_MESSAGES.OTP_EXPIRED);
    };
    this._isUsed = true
  };

  get id() {return this.props.id}
  get userId() {return this.props.userId}
  get code() {return this.props.code}
  get type() {return this.props.type}
  get expiresAt() {return this.props.expiresAt}
  get isUsed() {return this._isUsed}
  get createdAt() {return this.createdAt}
}