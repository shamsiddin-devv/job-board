import { OtpCode } from "../entities/OtpCode";

export interface IOtpRepository {
  findById(otpId: string): Promise<OtpCode | null>
  findByUserId(userId: string): Promise<OtpCode[]>
  findAll(): Promise<OtpCode[]>
  create(data: OtpCode): Promise<OtpCode>
  update(otpId: string, data: OtpCode): Promise<OtpCode>
  remove(otpId: string): Promise<void>
}