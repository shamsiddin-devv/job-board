import { DomainError } from './DomainError';

export class UnAthorizedError extends DomainError {
  constructor(message = 'No permission') {
    super(message);
    this.name = 'UnathorizedError';
  }
}
