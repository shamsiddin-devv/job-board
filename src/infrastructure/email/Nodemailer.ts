import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import type { INodeMailerService, SendEmailParams } from 'src/domain/services/IEmailService';

@Injectable()
export class NodemailerService implements INodeMailerService {
  private readonly transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const port = config.getOrThrow<number>('SMTP_PORT');
    const transport = host
      ? { host, port, secure: port === 465, requireTLS: port !== 465 }
      : { service: 'gmail' };
    this.transporter = nodemailer.createTransport({
      ...transport,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      auth: {
        user: config.get<string>('SMTP_USER') ?? config.getOrThrow<string>('SMTP_EMAIL'),
        pass: config.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  async send(params: SendEmailParams): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.config.getOrThrow<string>('SMTP_EMAIL'),
        ...params,
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      Logger.warn('SMTP send failed', NodemailerService.name);
      throw new ServiceUnavailableException('Email delivery is temporarily unavailable.');
    }
  }
}
