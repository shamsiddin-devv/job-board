import { DomainError } from "./DomainError";

export class NotFoundError extends DomainError {
  constructor(entity: string) {
    super(`${entity} Not Found !`, 404);
    this.name = 'NotFoundError'
  }
}