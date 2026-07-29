import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiPropertyOptional({
    example: 'https://cdn.workuz.uz/company/logo.png',
    description: 'Company logo URL.',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}