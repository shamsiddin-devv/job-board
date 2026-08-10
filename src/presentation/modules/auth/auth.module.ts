import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { RepositoriesModule } from 'src/infrastructure/repositories.module'

import { RegisterUseCase } from 'src/application/use-cases/auth/RegisterUseCase'
import { LoginUseCase } from 'src/application/use-cases/auth/LoginUseCase'
import { SendOtpUseCase } from 'src/application/use-cases/auth/SendOtpUseCase'
import { VerifyOtpUseCase } from 'src/application/use-cases/auth/VerifyOtpUseCase'
import { ConfirmRegistrationUseCase } from 'src/application/use-cases/auth/ConfirmRegistrationUseCase'
import { LogoutUseCase } from 'src/application/use-cases/auth/LogoutUseCase'
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/RefreshTokenUseCase'
import { OAuthLoginUseCase } from 'src/application/use-cases/auth/OAuthLoginUsecCase'
import { CompleteOAuthRegistrationUseCase } from 'src/application/use-cases/auth/CompleteOAuthRegistrationUseCase'
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/ForgotPasswordUseCase'
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/ResetPasswordUseCase'
import { VerifyResetPasswordOtpUseCase } from 'src/application/use-cases/auth/VerifyResetPasswordOtpUseCase'
import { GetMeUseCase } from 'src/application/use-cases/auth/GetMeUseCase'

import { GoogleStrategy } from 'src/infrastructure/auth/oauth/google.strategy'
import { GithubStrategy } from 'src/infrastructure/auth/oauth/github.strategy'

import type { IUserRepository } from 'src/domain/repositories/IUserRepository'
import type { IRefreshTokenRepository } from 'src/domain/repositories/IRefreshTokenRepository'
import type { IOtpRepository } from 'src/domain/repositories/IOtpRepository'
import type { IHashService } from 'src/domain/services/IHashService'
import type { ITokenService } from 'src/domain/services/ITokenService'
import { INodeMailerService } from 'src/domain/services/IEmailService'
import { ICacheRedisService } from 'src/domain/services/ICacheRedisService'

@Module({
  imports: [
    RepositoriesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    GithubStrategy,

    {
      provide: RegisterUseCase,
      useFactory: (
        userRepo: IUserRepository,
        redisService: ICacheRedisService,
        sendOtp: SendOtpUseCase,
      ) => new RegisterUseCase(userRepo, redisService, sendOtp),
      inject: ['IUserRepository', 'ICacheRedisService', SendOtpUseCase],
    },

    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: IUserRepository,
        refreshTokenRepo: IRefreshTokenRepository,
        tokenService: ITokenService,
        hashService: IHashService,
      ) => new LoginUseCase(userRepo, refreshTokenRepo, tokenService, hashService),
      inject: [
        'IUserRepository',
        'IRefreshTokenRepository',
        'ITokenService',
        'IHashService',
      ],
    },

    {
      provide: SendOtpUseCase,
      useFactory: (otpRepo: IOtpRepository, emailService: INodeMailerService) =>
        new SendOtpUseCase(otpRepo, emailService),
      inject: ['IOtpRepository', 'INodeMailerService'],
    },

    {
      provide: VerifyOtpUseCase,
      useFactory: (otpRepo: IOtpRepository) => new VerifyOtpUseCase(otpRepo),
      inject: ['IOtpRepository'],
    },

    {
      provide: ConfirmRegistrationUseCase,
      useFactory: (
        userRepo: IUserRepository,
        verifyOtp: VerifyOtpUseCase,
        redisService: ICacheRedisService
      ) =>
        new ConfirmRegistrationUseCase(
          userRepo,
          verifyOtp,
          redisService
        ),
      inject: [
        'IUserRepository',
        VerifyOtpUseCase,
        'ICacheRedisService'
      ],
    },

    {
      provide: LogoutUseCase,
      useFactory: (refreshTokenRepo: IRefreshTokenRepository) =>
        new LogoutUseCase(refreshTokenRepo),
      inject: ['IRefreshTokenRepository'],
    },

    {
      provide: RefreshTokenUseCase,
      useFactory: (
        userRepo: IUserRepository,
        refreshTokenRepo: IRefreshTokenRepository,
        tokenService: ITokenService,
      ) => new RefreshTokenUseCase(userRepo, refreshTokenRepo, tokenService),
      inject: ['IUserRepository', 'IRefreshTokenRepository', 'ITokenService'],
    },

    {
      provide: OAuthLoginUseCase,
      useFactory: (
        userRepo: IUserRepository,
        refreshTokenRepo: IRefreshTokenRepository,
        tokenService: ITokenService,
      ) => new OAuthLoginUseCase(userRepo, refreshTokenRepo, tokenService),
      inject: ['IUserRepository', 'IRefreshTokenRepository', 'ITokenService'],
    },

    {
      provide: CompleteOAuthRegistrationUseCase,
      useFactory: (
        userRepo: IUserRepository,
        tokenService: ITokenService,
        refreshTokenRepo: IRefreshTokenRepository,
      ) =>
        new CompleteOAuthRegistrationUseCase(
          userRepo,
          tokenService,
          refreshTokenRepo,
        ),
      inject: ['IUserRepository', 'ITokenService', 'IRefreshTokenRepository'],
    },

    {
      provide: ForgotPasswordUseCase,
      useFactory: (userRepo: IUserRepository, sendOtp: SendOtpUseCase) =>
        new ForgotPasswordUseCase(userRepo, sendOtp),
      inject: ['IUserRepository', SendOtpUseCase],
    },

    {
      provide: ResetPasswordUseCase,
      useFactory: (
        userRepo: IUserRepository,
        hashService: IHashService,
        refreshTokenRepo: IRefreshTokenRepository,
        tokenService: ITokenService
      ) => new ResetPasswordUseCase(userRepo, hashService, refreshTokenRepo, tokenService),
      inject: ['IUserRepository', 'IHashService', 'IRefreshTokenRepository', 'ITokenService'],
    },

    {
      provide: VerifyResetPasswordOtpUseCase,
      useFactory: (
        userRepo: IUserRepository,
        verifyOtp: VerifyOtpUseCase,
        tokenService: ITokenService,
      ) => new VerifyResetPasswordOtpUseCase(userRepo, verifyOtp, tokenService),
      inject: ['IUserRepository', VerifyOtpUseCase, 'ITokenService'],
    },

    {
      provide: GetMeUseCase,
      useFactory: (userRepo: IUserRepository) => new GetMeUseCase(userRepo),
      inject: ['IUserRepository'],
    },
  ],
})
export class AuthModule {}