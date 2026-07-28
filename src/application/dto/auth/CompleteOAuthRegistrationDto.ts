export interface CompleteOAuthRegistrationDto {
  email: string
  fullName: string
  avatarUrl?: string
  provider?: 'google' | 'github'
  role?: 'company' | 'worker'
}