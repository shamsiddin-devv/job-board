import { DomainError } from './DomainError';

export class UnauthorizedError extends DomainError {
  constructor(message = 'No permission.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
