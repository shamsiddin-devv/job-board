import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginUseCase } from 'src/application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from 'src/application/use-cases/auth/RegisterUseCase';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginUseCase } from 'src/application/use-cases/auth/OAuthLoginUsecCase';
import type { Request, Response } from 'express';
import { LogoutUseCase } from 'src/application/use-cases/auth/LogoutUseCase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly oAuthLoginUseCase: OAuthLoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {};

  @Post('auth/register')
  async register(@Body() dto: RegisterDto) {
    await this.registerUseCase.execute(dto);
  };

  @Post('auth/login')
  async login(@Body() dto: LoginDto) {
    await this.loginUseCase.execute(dto)
  };

  @Post('auth/logout')
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
