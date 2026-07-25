import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginUseCase } from 'src/application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from 'src/application/use-cases/auth/RegisterUseCase';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginUseCase } from 'src/application/use-cases/auth/OAuthLoginUsecCase';
import type { Request, Response } from 'express';
import { LogoutUseCase } from 'src/application/use-cases/auth/LogoutUseCase';
import { SendOtpUseCase } from 'src/application/use-cases/auth/SendOtpUseCase';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { ConfirmRegistrationUseCase } from 'src/application/use-cases/auth/ConfirmRegistrationUseCase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly oAuthLoginUseCase: OAuthLoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly confirmRegistration: ConfirmRegistrationUseCase
  ) {};

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    await this.registerUseCase.execute(dto);
  };

  @Post('send/otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.sendOtpUseCase.execute(dto.email);
  };

  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.confirmRegistration.execute(dto);
  };

  @Post('login')
  async login(@Body() dto: LoginDto) {
    await this.loginUseCase.execute(dto)
  };

  @Post('logout')
  async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    await this.logoutUseCase.execute(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  };



  // @Get('auth/google')
  // async google() {

  // }


};
