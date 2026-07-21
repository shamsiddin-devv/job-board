import { AUTH_MESSAGES } from '../constants/message';
import { BadRequestError } from '../errors/BadRequestError';
import { ValidationError } from '../errors/ValidationError';

export class Email {
  private value: string;

  constructor(email: string) {
    if(!email) throw new BadRequestError(AUTH_MESSAGES.EMAIL_REQUIRED)
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) throw new ValidationError(AUTH_MESSAGES.INVALID_EMAIL);
    this.value = email.toLowerCase().trim();
  }

  toString() {
    return this.value;
  }
  equals(other: Email) {
    return this.value === other.value;
  }
}
