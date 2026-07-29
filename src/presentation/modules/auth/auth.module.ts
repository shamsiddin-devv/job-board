import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RepositoriesModule } from 'src/infrastructure/repositories.module';
import { PassportModule } from '@nestjs/passport';
import { RegisterUseCase } from 'src/application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from 'src/application/use-cases/auth/LoginUseCase';
import { SendOtpUseCase } from 'src/application/use-cases/auth/SendOtpUseCase';
import { VerifyOtpUseCase } from 'src/application/use-cases/auth/VerifyOtpUseCase';
import { ConfirmRegistrationUseCase } from 'src/application/use-cases/auth/ConfirmRegistrationUseCase';
import { LogoutUseCase } from 'src/application/use-cases/auth/LogoutUseCase';
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/RefreshTokenUseCase';
import { OAuthLoginUseCase } from 'src/application/use-cases/auth/OAuthLoginUsecCase';
import { CompleteOAuthRegistrationUseCase } from 'src/application/use-cases/auth/CompleteOAuthRegistrationUseCase';
import { ForgotPasswordUseCase } from 'src/application/use-cases/auth/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/ResetPasswordUseCase';
import { GoogleStrategy } from 'src/infrastructure/auth/oauth/google.strategy';
import { GithubStrategy } from 'src/infrastructure/auth/oauth/github.strategy';
import { VerifyResetPasswordOtpUseCase } from 'src/application/use-cases/auth/VerifyResetPasswordOtpUseCase';

@Module({
  imports: [
    RepositoriesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    SendOtpUseCase,
    VerifyOtpUseCase,
    ConfirmRegistrationUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    OAuthLoginUseCase,
    CompleteOAuthRegistrationUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    GoogleStrategy,
    GithubStrategy,
    VerifyResetPasswordOtpUseCase
  ],
})
export class AuthModule {}
