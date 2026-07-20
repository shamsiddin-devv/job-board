import { OtpCode } from 'src/domain/entities/OtpCode';
import { IOtpRepository } from 'src/domain/repositories/IOtpRepository';
import { INodeMailerService } from 'src/domain/services/IEmailService';
import { Email } from 'src/domain/value-objects/Email';

export class SendOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly nodemailerService: INodeMailerService,
  ) {}

  async execute(emailStr: string) {
    const email = new Email(emailStr);

    const code = OtpCode.generateCode();

    await this.otpRepo.create(email.toString(), code)

    await this.nodemailerService.send({
      to: email.toString(),
      subject: 'Tasdiqlash kodi — JobBoard',
      text: `Sizning kodingiz: ${code}`,
      html: this.buildHtml(code)
    });
  };

  private buildHtml(code: string): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #111111; font-size: 20px; font-weight: 600; margin: 0;">JobBoard</h1>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 12px; padding: 32px 24px; text-align: center;">
        <p style="color: #555555; font-size: 14px; margin: 0 0 16px 0;">
          Tasdiqlash kodingiz
        </p>
        <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111111; margin-bottom: 16px;">
          ${code}
        </div>
        <p style="color: #999999; font-size: 13px; margin: 0;">
          Kod 5 daqiqa davomida amal qiladi
        </p>
      </div>
      <p style="color: #999999; font-size: 12px; text-align: center; margin-top: 32px;">
        Agar siz bu so'rovni yubormagan bo'lsangiz, bu xatni e'tiborsiz qoldiring.
      </p>
    </div>`;
  }
}
