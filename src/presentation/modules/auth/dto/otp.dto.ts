import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'john@gmail.com',
  })
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
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