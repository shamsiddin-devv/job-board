import { DomainError } from "./DomainError";

export class NotFoundError extends DomainError {
  constructor(entity: string) {
    super(`${entity} Not Found !`);
    this.name = 'NotFoundError'
  }
}