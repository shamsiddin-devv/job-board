export interface IOtpRepository {
  find(email: string): Promise<string | null>
  create(email: string, code: string): Promise<void>
  remove(email: string): Promise<void>
}