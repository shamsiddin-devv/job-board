import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { oauthStateStore } from './oauth-state';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    const options = {
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['openid', 'email', 'profile'],
      store: oauthStateStore('google'),
    };
    super(options);
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const data = profile._json as { email?: string; email_verified?: boolean; verified_email?: boolean };
    if (!data.email || (data.email_verified !== true && data.verified_email !== true)) {
      throw new UnauthorizedException('Google did not supply a verified email.');
    }
    return {
      email: data.email,
      fullName: profile.displayName || data.email,
      avatarUrl: profile.photos?.[0]?.value,
      provider: 'google',
    };
  }
}
