import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
import { CompleteOAuthRegistrationUseCase } from 'src/application/use-cases/auth/CompleteOAuthRegistrationUseCase';
import type { CompleteOAuthDto } from './dto/complete-oauth.dto';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/ForgotPasswordUseCase';
import { VerifyResetPasswordOtpUseCase } from 'src/application/use-cases/auth/VerifyResetPasswordOtpUseCase';
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/ResetPasswordUseCase';
import type { VerifyResetPasswordOtpDto } from './dto/verify-reset-password-otp.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly oAuthLoginUseCase: OAuthLoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly confirmRegistration: ConfirmRegistrationUseCase,
    private readonly completeOAuthUseCase: CompleteOAuthRegistrationUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyResetPasswordOtpUseCase: VerifyResetPasswordOtpUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.sendOtpUseCase.execute(dto.email);
  }

  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.confirmRegistration.execute(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(dto);

    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    await this.logoutUseCase.execute(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto.email);
  };

  @Post('verify-reset-password-otp')
  async verifyResetPasswordOtp(dto: VerifyResetPasswordOtpDto) {
    return this.verifyResetPasswordOtpUseCase.execute(dto);
  };

  @Post('reset-password')
  async resetPassword(dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto); 
  };
  
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.oAuthLoginUseCase.execute(req.user);

    if (result.requiresRoleSelection) {
      return result;
    }

    this.setRefreshTokenCookie(res, result.refreshToken!)
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('complete-oauth')
  async completeOAuthGoogle(
    @Body() dto: CompleteOAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.completeOAuthUseCase.execute(dto);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return { accessToken: result.accessToken };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.oAuthLoginUseCase.execute(req.user);

    if (result.requiresRoleSelection) {
      return result;
    }

    this.setRefreshTokenCookie(res, result.refreshToken!)

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  };

}
