import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';

export function mountFrontend(
  app: NestExpressApplication,
  root = resolve(__dirname, '../../../../frontend-dist'),
): void {
  const index = join(root, 'index.html');
  if (!existsSync(index)) return;

  app.useStaticAssets(join(root, 'assets'), {
    prefix: '/assets',
    index: false,
    redirect: false,
    immutable: true,
    maxAge: '1y',
  });
  app.useStaticAssets(root, { index: false, redirect: false });

  app.use((request: Request, response: Response, next: NextFunction) => {
    const path = request.path;
    const reserved = /^\/(?:api|assets)(?:\/|$)|^\/api-docs(?:[\/-]|$)/i.test(path);
    const isPageRequest = ['GET', 'HEAD'].includes(request.method) &&
      !reserved && !extname(path) && request.accepts('html');
    if (!isPageRequest) return next();

    response.setHeader('Cache-Control', 'no-cache');
    return response.sendFile(index);
  });
}
