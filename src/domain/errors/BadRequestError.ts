import { DomainError } from "./DomainError";

export class BadRequestError extends DomainError {
  constructor(message) {
    super(message)
    this.name = "BadRequestError"
  }
}