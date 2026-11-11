import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { mountFrontend } from './presentation/frontend/mount-frontend';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApp(app);
  app.enableShutdownHooks();
  await app.listen(app.get(ConfigService).getOrThrow<number>('PORT'), '0.0.0.0');
}

export function configureApp(app: NestExpressApplication) {
  const settings = app.get(ConfigService);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('JobBoard API')
    .setDescription('REST API documentation for JobBoard')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter access token',
      },
      'access-token',
    )
    .build();
  if (settings.get('NODE_ENV') !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(cookieParser(process.env.ACCESS_TOKEN_SECRET));
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  const allowedOrigins = (settings.getOrThrow<string>('FRONTEND_URL'))
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header) and any localhost dev port.
      if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  });

  mountFrontend(app);
}

if (require.main === module) {
  void bootstrap().catch((error: unknown) => {
    Logger.error(error instanceof Error ? error.message : 'Startup failed', 'Bootstrap');
    process.exitCode = 1;
  });
}
