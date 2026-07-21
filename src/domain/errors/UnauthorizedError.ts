import { DomainError } from './DomainError';

export class UnauthorizedError extends DomainError {
  constructor(message = 'No permission.') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}
