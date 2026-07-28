import { IsOptional, IsString, IsUrl } from 'class-validator'
 
export class CreateCompanyDto {
  @IsString()
  name: string
 
  @IsOptional()
  @IsString()
  description?: string
 
  @IsOptional()
  @IsUrl()
  website?: string
 
  @IsOptional()
  @IsString()
  industry?: string
 
  @IsOptional()
  @IsString()
  size?: string
 
  @IsOptional()
  @IsString()
  city?: string
}