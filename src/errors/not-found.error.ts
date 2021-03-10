import { BaseError } from '../common/classes/base-error.abstract';
import { IErrorPayload } from '../common/interfaces/error-payload.interface';

export class NotFoundError extends BaseError {
  statusCode = 404;

  constructor() {
    super('Not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): IErrorPayload[] {
    return [{ message: 'Not found' }];
  }
}
