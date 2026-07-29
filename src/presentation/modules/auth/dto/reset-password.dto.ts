import { ApiProperty } from '@nestjs/swagger';
import {
  IsJWT,
  IsString,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsJWT()
  resetToken: string;

  @ApiProperty({
    example: 'NewPassword123!',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}