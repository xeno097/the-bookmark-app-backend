import { BaseError } from '../common/classes/base-error.abstract';
import { IErrorPayload } from '../common/interfaces/error-payload.interface';

export class InvalidFunctionInputError extends BaseError {
  statusCode = 500;

  constructor() {
    super('Invalid function input');

    Object.setPrototypeOf(this, InvalidFunctionInputError.prototype);
  }

  serializeErrors(): IErrorPayload[] {
    return [{ message: this.message }];
  }
}
