export interface CreateResumeDto {
  title: string;
  summary?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: 'UZS' | 'USD';
}