

export interface RegisterDto {
  email: string,
  name: string,
  phone?: string,
  password: string,
  role: 'company' | 'worker',
  avatarUrl?: string,
};