export class RegisterDto {
  email: string;
  fullName: string;
  phone?: string;
  password: string;
  role: 'company' | 'worker';
  avatarUrl?: string;
}