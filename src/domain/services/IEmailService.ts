export interface SendEmailParams  {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface INodeMailerService {
  send(prop: SendEmailParams ): Promise<void>
};