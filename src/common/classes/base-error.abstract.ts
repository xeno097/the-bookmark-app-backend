import { IErrorPayload } from '../interfaces/error-payload.interface';

export abstract class BaseError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeErrors(): IErrorPayload[];
}
