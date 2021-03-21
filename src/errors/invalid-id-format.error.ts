import { BaseError } from '../common/classes/base-error.abstract';
import { IErrorPayload } from '../common/interfaces/error-payload.interface';

const errorMessage = 'Invalid id format';

export class InvalidIdFormatError extends BaseError {
  statusCode = 400;
  constructor() {
    super(errorMessage);

    Object.setPrototypeOf(this, InvalidIdFormatError.prototype);
  }

  serializeErrors(): IErrorPayload[] {
    return [
      {
        message: errorMessage,
        field: 'id',
      },
    ];
  }
}
