import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ApplyToJobDto {
  @ApiPropertyOptional({
    example: 'I have 3 years of experience with NestJS and Node.js.',
    description: 'Optional cover letter.',
  })
  @IsOptional()
  @IsString()
  coverLetter?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.workuz.uz/resumes/resume.pdf',
    description: 'Resume file URL.',
  })
  @IsOptional()
  @IsString()
  resumeUrl?: string;
}