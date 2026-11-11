import type { OtpType } from '../entities/OtpCode';

export type OtpResult = 'verified' | 'invalid' | 'expired';

export interface IOtpRepository {
  create(email: string, purpose: OtpType, code: string): Promise<boolean>;
  consume(email: string, purpose: OtpType, code: string): Promise<OtpResult>;
}
