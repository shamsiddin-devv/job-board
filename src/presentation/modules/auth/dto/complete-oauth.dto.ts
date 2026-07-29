import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

export class CompleteOAuthDto {
  @ApiProperty({ example: 'john@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'https://avatar.com/image.png',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({
    enum: ['company', 'worker'],
  })
  @IsIn(['company', 'worker'])
  role: 'company' | 'worker';

  @ApiProperty({
    enum: ['google', 'github'],
  })
  @IsIn(['google', 'github'])
  provider: 'google' | 'github';
}