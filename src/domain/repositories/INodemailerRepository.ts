export interface IProp {
  to: string;
  subject: string;
  text?: string;
  html?: string; 
}

export interface INodemailerRepository {
  send(prop: IProp): Promise<void>
};