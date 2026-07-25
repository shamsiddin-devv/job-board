export interface IOtpRepository {
  find(email: string): Promise<string | null>
  create(email: string, code: string): Promise<void>
  delete(email: string): Promise<void>
}