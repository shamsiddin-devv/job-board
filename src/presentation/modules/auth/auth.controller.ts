import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import type { Request, Response } from 'express'

import { LoginUseCase } from 'src/application/use-cases/auth/LoginUseCase'
import { RegisterUseCase } from 'src/application/use-cases/auth/RegisterUseCase'
import { OAuthLoginUseCase } from 'src/application/use-cases/auth/OAuthLoginUsecCase'
import { LogoutUseCase } from 'src/application/use-cases/auth/LogoutUseCase'
import { SendOtpUseCase } from 'src/application/use-cases/auth/SendOtpUseCase'
import { ConfirmRegistrationUseCase } from 'src/application/use-cases/auth/ConfirmRegistrationUseCase'
import { CompleteOAuthRegistrationUseCase } from 'src/application/use-cases/auth/CompleteOAuthRegistrationUseCase'
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/RefreshTokenUseCase'
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/ForgotPasswordUseCase'
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/ResetPasswordUseCase'

import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { CompleteOAuthDto } from './dto/complete-oauth.dto'

@ApiTags('Auth')
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
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
  }

  @ApiOperation({ summary: 'Ro\'yxatdan o\'tish — OTP avtomatik yuboriladi' })
  @ApiResponse({ status: 201, description: 'Ro\'yxatdan o\'tildi, kod yuborildi' })
  @ApiResponse({ status: 409, description: 'Email allaqachon band' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.registerUseCase.execute(dto)
  }

  @ApiOperation({ summary: 'Tasdiqlash kodini qayta yuborish' })
  @ApiResponse({ status: 200, description: 'Kod yuborildi' })
  @Post('send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    return await this.sendOtpUseCase.execute(dto.email)
  }

  @ApiOperation({ summary: 'OTP kodni tasdiqlab, ro\'yxatdan o\'tishni yakunlash' })
  @ApiResponse({ status: 200, description: 'Tasdiqlandi, token qaytariladi' })
  @ApiResponse({ status: 400, description: 'Kod noto\'g\'ri yoki muddati tugagan' })
  @Post('verify')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.confirmRegistration.execute(dto)
    this.setRefreshTokenCookie(res, result.refreshToken)
    return { accessToken: result.accessToken, user: result.user }
  }

  @ApiOperation({ summary: 'Email va parol orqali kirish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli kirildi' })
  @ApiResponse({ status: 401, description: 'Email yoki parol noto\'g\'ri' })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute(dto)
    this.setRefreshTokenCookie(res, result.refreshToken)
    return { accessToken: result.accessToken, user: result.user }
  }

  @ApiOperation({ summary: 'Yangi access token olish (refresh token orqali)' })
  @ApiResponse({ status: 200, description: 'Yangi access token qaytarildi' })
  @ApiResponse({ status: 401, description: 'Refresh token yaroqsiz' })
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken
    return await this.refreshTokenUseCase.execute(refreshToken)
  }

  @ApiOperation({ summary: 'Tizimdan chiqish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli chiqildi' })
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken
    await this.logoutUseCase.execute(refreshToken)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
  }

  @ApiOperation({ summary: 'Parolni unutdim — tasdiqlash kodi yuboriladi' })
  @ApiResponse({ status: 200, description: 'Agar email mavjud bo\'lsa, kod yuborildi' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.forgotPasswordUseCase.execute(dto.email)
  }

  @ApiOperation({ summary: 'Kod orqali yangi parol o\'rnatish' })
  @ApiResponse({ status: 200, description: 'Parol muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 400, description: 'Kod noto\'g\'ri' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.resetPasswordUseCase.execute(dto)
  }

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.oAuthLoginUseCase.execute(req.user)
    if (result.requiresRoleSelection) return result

    this.setRefreshTokenCookie(res, result.refreshToken!)
    return { accessToken: result.accessToken, user: result.user }
  }

  @ApiExcludeEndpoint()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @ApiExcludeEndpoint()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.oAuthLoginUseCase.execute(req.user)
    if (result.requiresRoleSelection) return result

    this.setRefreshTokenCookie(res, result.refreshToken!)
    return { accessToken: result.accessToken, user: result.user }
  }

  @ApiOperation({ summary: 'OAuth orqali yangi user uchun rolni tanlab ro\'yxatni yakunlash' })
  @ApiResponse({ status: 201, description: 'Ro\'yxat yakunlandi, token qaytarildi' })
  @Post('complete-oauth')
  async completeOAuth(
    @Body() dto: CompleteOAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.completeOAuthUseCase.execute(dto)
    this.setRefreshTokenCookie(res, result.refreshToken)
    return { accessToken: result.accessToken }
  }
}