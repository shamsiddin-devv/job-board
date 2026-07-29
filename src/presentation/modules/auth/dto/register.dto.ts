import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'john@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({
    example: '+998901234567',
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiProperty({
    example: 'Password123!',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: ['company', 'worker'],
  })
  @IsIn(['company', 'worker'])
  role: 'company' | 'worker';

  @ApiPropertyOptional({
    example: 'https://avatar.com/avatar.png',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}