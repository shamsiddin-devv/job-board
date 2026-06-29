import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer"
import { INodemailerRepository, IProp } from "src/domain/services/INodemailerRepository";

export class Nodemailer implements INodemailerRepository {
  private readonly configService = new ConfigService();
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: this.configService.get('SMTP_EMAIL'),
      pass: this.configService.get('SMTP_PASS')
    }
  });

  async send(prop: IProp): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_EMAIL'),
      ...prop
    })
  }
}