import { DomainError } from "./DomainError";

export class BadRequestError extends DomainError {
  constructor(message) {
    super(message, 400)
    this.name = "BadRequestError"
  }
}