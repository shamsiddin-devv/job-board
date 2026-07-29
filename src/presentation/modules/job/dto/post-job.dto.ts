import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PostJobDto {
  @ApiProperty({
    example: 'Backend Developer',
    description: 'Job title.',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'We are looking for an experienced NestJS developer.',
    description: 'Job description.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ['job', 'resume'],
    example: 'job',
    description: 'Post type.',
  })
  @IsEnum(['job', 'resume'])
  postType: 'job' | 'resume';

  @ApiProperty({
    enum: ['full_time', 'part_time', 'freelance', 'internship'],
    example: 'full_time',
    description: 'Employment type.',
  })
  @IsEnum(['full_time', 'part_time', 'freelance', 'internship'])
  jobType: 'full_time' | 'part_time' | 'freelance' | 'internship';

  @ApiProperty({
    enum: ['remote', 'onsite', 'hybrid'],
    example: 'remote',
    description: 'Work format.',
  })
  @IsEnum(['remote', 'onsite', 'hybrid'])
  workFormat: 'remote' | 'onsite' | 'hybrid';

  @ApiPropertyOptional({
    example: 'Tashkent',
    description: 'Job location.',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 5000000,
    description: 'Minimum salary.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({
    example: 10000000,
    description: 'Maximum salary.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @ApiProperty({
    enum: ['UZS', 'USD'],
    example: 'UZS',
    description: 'Salary currency.',
  })
  @IsEnum(['UZS', 'USD'])
  currency: 'UZS' | 'USD';
}