import { IsNumber, IsOptional, IsString } from "class-validator"

export class SearchResumesQueryDto {
  @IsOptional()
  @IsString()
  city?: string
 
  @IsOptional()
  @IsNumber()
  salaryMin?: number
 
  @IsOptional()
  @IsString()
  search?: string
 
  @IsOptional()
  @IsNumber()
  page?: number
 
  @IsOptional()
  @IsNumber()
  limit?: number
}