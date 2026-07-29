import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
} from 'class-validator';

export class VerifyResetPasswordOtpDto {
  @ApiProperty({
    example: 'john@gmail.com',
  })
  @IsEmail()
  emailStr: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  inputCode: string;
}