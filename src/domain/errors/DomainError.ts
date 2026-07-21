export class DomainError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'DomainError'
  }
}