import { BaseError } from '../common/classes/base-error.abstract';
import { IErrorPayload } from '../common/interfaces/error-payload.interface';

export class UnauthorizedError extends BaseError {
  statusCode = 401;
  message = 'Unauthorized user';

  constructor() {
    super('Unauthorized user');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors(): IErrorPayload[] {
    return [
      {
        message: this.message,
      },
    ];
  }
}
