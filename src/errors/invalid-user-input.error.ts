import { BaseError } from '../common/classes/base-error.abstract';
import { IErrorPayload } from '../common/interfaces/error-payload.interface';

export class InvalidUserInputError extends BaseError {
  statusCode = 400;

  constructor() {
    super('Invalid user input');

    Object.setPrototypeOf(this, InvalidUserInputError.prototype);
  }

  serializeErrors(): IErrorPayload[] {
    return [];
  }
}
