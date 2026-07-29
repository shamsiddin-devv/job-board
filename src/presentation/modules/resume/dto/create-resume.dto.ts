import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({
    example: 'Senior Backend Developer',
    description: 'Resume title.',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: '5+ years of experience with Node.js and NestJS.',
    description: 'Professional summary.',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    example: 'Samarkand',
    description: 'Current city.',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 7000000,
    description: 'Expected minimum salary.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiProperty({
    enum: ['UZS', 'USD'],
    example: 'UZS',
    description: 'Preferred salary currency.',
  })
  @IsEnum(['UZS', 'USD'])
  currency: 'UZS' | 'USD';
}