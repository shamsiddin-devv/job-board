import { OtpCode } from "../entities/OtpCode";

export interface IOtpRepository {
  find(email: string): Promise<void>
  create(email: string, code: string): Promise<void>
  remove(email: string): Promise<void>
}