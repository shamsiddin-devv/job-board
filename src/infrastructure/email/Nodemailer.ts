import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer"
import { INodeMailerService, SendEmailParams  } from "src/domain/services/IEmailService";

@Injectable()
export class NodemailerService implements INodeMailerService {
  private transporter: nodemailer.transporter

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('SMTP_EMAIL'),
        pass: this.configService.get('SMTP_PASS')
      }
    });
  }

  async send(params: SendEmailParams ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_EMAIL'),
        ...params
      })
    }catch(err) {
      throw new Error('Error occurred while sending the code to email.')
    }
  }
}