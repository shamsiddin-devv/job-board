import { BadRequestError } from '../errors/BadRequestError';
import { ValidationError } from '../errors/ValidationError';

export class Email {
  private value: string;

  constructor(email: string) {
    if(!email) throw new BadRequestError('Email is required.')
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) throw new ValidationError('Invalid email format.');
    this.value = email.toLowerCase().trim();
  }

  toString() {
    return this.value;
  }
  equals(other: Email) {
    return this.value === other.value;
  }
}
