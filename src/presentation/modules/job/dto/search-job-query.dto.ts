import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchJobsQueryDto {
  @ApiPropertyOptional({
    example: 'Samarkand',
    description: 'Filter jobs by city.',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    enum: ['job', 'resume'],
    example: 'job',
    description: 'Filter by post type.',
  })
  @IsOptional()
  @IsEnum(['job', 'resume'])
  postType?: 'job' | 'resume';

  @ApiPropertyOptional({
    enum: ['full_time', 'part_time', 'freelance', 'internship'],
    example: 'full_time',
    description: 'Filter by job type.',
  })
  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'freelance', 'internship'])
  jobType?: 'full_time' | 'part_time' | 'freelance' | 'internship';

  @ApiPropertyOptional({
    enum: ['remote', 'onsite', 'hybrid'],
    example: 'remote',
    description: 'Filter by work format.',
  })
  @IsOptional()
  @IsEnum(['remote', 'onsite', 'hybrid'])
  workFormat?: 'remote' | 'onsite' | 'hybrid';

  @ApiPropertyOptional({
    example: 5000000,
    description: 'Minimum salary.',
  })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiPropertyOptional({
    example: 10000000,
    description: 'Maximum salary.',
  })
  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @ApiPropertyOptional({
    example: 'NestJS',
    description: 'Search by title or keyword.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ['newest', 'salary_high', 'salary_low', 'most_viewed'],
    example: 'newest',
    description: 'Sorting option.',
  })
  @IsOptional()
  @IsEnum(['newest', 'salary_high', 'salary_low', 'most_viewed'])
  sortBy?: 'newest' | 'salary_high' | 'salary_low' | 'most_viewed';

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number.',
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page.',
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}