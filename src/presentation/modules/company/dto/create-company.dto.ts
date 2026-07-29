import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'OpenAI',
    description: 'Company name.',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Artificial Intelligence company.',
    description: 'Company description.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://openai.com',
    description: 'Company website.',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    example: 'Information Technology',
    description: 'Company industry.',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    example: '51-200',
    description: 'Company size.',
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({
    example: 'Samarkand',
    description: 'Company city.',
  })
  @IsOptional()
  @IsString()
  city?: string;
}