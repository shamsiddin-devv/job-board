import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class OAuthDto {
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

  @ApiProperty({
    required: false,
    example: 'https://avatar.com/photo.png',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({
    enum: ['google', 'github'],
    required: false,
  })
  @IsOptional()
  @IsIn(['google', 'github'])
  provider?: 'google' | 'github';
}