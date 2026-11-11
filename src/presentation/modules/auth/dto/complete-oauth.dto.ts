import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

export class CompleteOAuthDto {
  @ApiProperty({ enum: ['company', 'worker'] })
  @IsIn(['company', 'worker'])
  role: 'company' | 'worker';

  // Existing clients can continue sending the display fields during rollout.
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ enum: ['google', 'github'] })
  @IsOptional()
  @IsIn(['google', 'github'])
  provider?: 'google' | 'github';
}
