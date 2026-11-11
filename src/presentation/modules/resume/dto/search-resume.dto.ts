import { IsInt as IsPageInteger, Min as MinPage, Max as MaxPage } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchResumesQueryDto {
  @ApiPropertyOptional({
    example: 'Tashkent',
    description: 'Filter resumes by city.',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 5000000,
    description: 'Minimum expected salary.',
  })
  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @ApiPropertyOptional({
    example: 'Backend Developer',
    description: 'Search by title or keyword.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number.',
  })
  @IsOptional()
  @IsPageInteger()
  @MinPage(1)
  @MaxPage(10000)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page.',
  })
  @IsOptional()
  @IsPageInteger()
  @MinPage(1)
  @MaxPage(100)
  limit?: number;
}