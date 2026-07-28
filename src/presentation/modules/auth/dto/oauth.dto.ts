export interface OAuthDto {
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider?: 'google' | 'github'
}
