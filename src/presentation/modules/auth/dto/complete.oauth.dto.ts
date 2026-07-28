export interface CompleteOAuthDto {
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'company' | 'worker';
  provider: 'google' | 'github';
};