import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class PostJobDto {
  @IsString()
  title: string
 
  @IsOptional()
  @IsString()
  description?: string
 
  @IsEnum(['job', 'resume'])
  postType: 'job' | 'resume'
 
  @IsEnum(['full_time', 'part_time', 'freelance', 'internship'])
  jobType: 'full_time' | 'part_time' | 'freelance' | 'internship'
 
  @IsEnum(['remote', 'onsite', 'hybrid'])
  workFormat: 'remote' | 'onsite' | 'hybrid'
 
  @IsOptional()
  @IsString()
  city?: string
 
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number
 
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number
 
  @IsEnum(['UZS', 'USD'])
  currency: 'UZS' | 'USD'
}