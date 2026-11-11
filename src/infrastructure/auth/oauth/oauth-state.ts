import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { CookieOptions, Request } from 'express';
import type { Metadata, StateStoreStoreCallback, StateStoreVerifyCallback } from 'passport-oauth2';

export const oauthCookieOptions = {
  httpOnly: true,
  signed: true,
  get secure() { return process.env.NODE_ENV === 'production'; },
  sameSite: 'lax',
  path: '/',
  maxAge: 600000,
} satisfies CookieOptions;

export function oauthStateStore(provider: 'google' | 'github') {
  const name = `workuz_oauth_state_${provider}`;
  return {
    store(req: Request, metaOrDone: Metadata | StateStoreStoreCallback, callback?: StateStoreStoreCallback) {
      const state = randomBytes(32).toString('hex');
      req.res!.cookie(name, { state, expiresAt: Date.now() + 600000 }, oauthCookieOptions);
      const done = typeof metaOrDone === 'function' ? metaOrDone : callback!;
      done(null, state);
    },
    verify(req: Request, state: string, metaOrDone: Metadata | StateStoreVerifyCallback, callback?: StateStoreVerifyCallback) {
      const saved = req.signedCookies?.[name] as { state: string; expiresAt: number } | undefined;
      req.res!.clearCookie(name, { path: '/', httpOnly: true, secure: oauthCookieOptions.secure, sameSite: 'lax' });
      const valid = typeof state === 'string' && /^[a-f0-9]{64}$/.test(state) &&
        !!saved?.state && saved.expiresAt >= Date.now() &&
        timingSafeEqual(Buffer.from(state, 'hex'), Buffer.from(saved.state, 'hex'));
      const done = typeof metaOrDone === 'function' ? metaOrDone : callback!;
      done(null, valid, undefined);
    },
  };
}
