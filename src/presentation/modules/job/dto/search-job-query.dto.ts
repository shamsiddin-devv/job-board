import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class SearchJobsQueryDto {
  @IsOptional()
  @IsString()
  city?: string
 
  @IsOptional()
  @IsEnum(['job', 'resume'])
  postType?: 'job' | 'resume'
 
  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'freelance', 'internship'])
  jobType?: 'full_time' | 'part_time' | 'freelance' | 'internship'
 
  @IsOptional()
  @IsEnum(['remote', 'onsite', 'hybrid'])
  workFormat?: 'remote' | 'onsite' | 'hybrid'
 
  @IsOptional()
  @IsNumber()
  salaryMin?: number
 
  @IsOptional()
  @IsNumber()
  salaryMax?: number
 
  @IsOptional()
  @IsString()
  search?: string
 
  @IsOptional()
  @IsEnum(['newest', 'salary_high', 'salary_low', 'most_viewed'])
  sortBy?: 'newest' | 'salary_high' | 'salary_low' | 'most_viewed'
 
  @IsOptional()
  @IsNumber()
  page?: number
 
  @IsOptional()
  @IsNumber()
  limit?: number
}