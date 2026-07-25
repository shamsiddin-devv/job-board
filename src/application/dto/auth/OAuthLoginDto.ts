export class OAuthLoginDto {
  email: string
  fullName: string
  avatarUrl?: string
  provider: 'google' | 'github'
  role: 'company' | 'worker'
}