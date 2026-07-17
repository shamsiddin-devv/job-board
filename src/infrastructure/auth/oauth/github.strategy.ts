import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const {name, emails, photos} = profile;
    return {
      name: `${name!.givenName} ${name!.familyName}`,
      email: emails![0].value,
      photos: photos![0].value
    };
  };
}
