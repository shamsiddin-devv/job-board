import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator'
 
export class CreateResumeDto {
  @IsString()
  title: string
 
  @IsOptional()
  @IsString()
  summary?: string
 
  @IsOptional()
  @IsString()
  city?: string
 
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number
 
  @IsEnum(['UZS', 'USD'])
  currency: 'UZS' | 'USD'
}