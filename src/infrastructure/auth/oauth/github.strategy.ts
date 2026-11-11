import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { oauthStateStore } from './oauth-state';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    const options = {
      clientID: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
      store: oauthStateStore('github'),
    };
    super(options);
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new UnauthorizedException('GitHub email verification failed.');
    const emails = await response.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
    const email = emails.find((entry) => entry.primary && entry.verified)?.email;
    if (!email) throw new UnauthorizedException('GitHub did not supply a verified primary email.');
    return {
      email,
      fullName: profile.displayName || profile.username || email,
      avatarUrl: profile.photos?.[0]?.value,
      provider: 'github',
    };
  }
}
