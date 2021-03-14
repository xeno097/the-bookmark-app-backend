import { BaseError } from '../common/classes/base-error.abstract';
import { IErrorPayload } from '../common/interfaces/error-payload.interface';

export class InvalidUserInputError extends BaseError {
  statusCode = 400;

  private messages: IErrorPayload[];

  constructor(messages: IErrorPayload[] = []) {
    super('Invalid user input');

    Object.setPrototypeOf(this, InvalidUserInputError.prototype);

    this.messages = messages;
  }

  serializeErrors(): IErrorPayload[] {
    return this.messages;
  }
}
