export class SendOtpDto {
  email: string;
};

export class VerifyOtpDto {
  emailStr: string;
  inputCode: string;
};