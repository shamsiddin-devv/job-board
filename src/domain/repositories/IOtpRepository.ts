import { OtpCode } from "../entities/OtpCode";

export interface IOtpRepository {
  find(email: string): Promise<void>
  create(email: string, code: number): Promise<void>
  remove(email: string): Promise<void>
}