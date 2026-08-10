import { DomainError } from "./DomainError";

export class NotFoundError extends DomainError {
  constructor(entity: string) {
    super(entity, 404);
    this.name = 'NotFoundError'
  }
}