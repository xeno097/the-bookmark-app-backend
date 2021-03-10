import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../common/classes/base-error.abstract';
import { IResponsePayload } from '../common/interfaces/response.interface';

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const response: IResponsePayload = {
    ok: false,
    data: {},
    errors: [{ message: 'An error occured' }],
  };

  if (err instanceof BaseError) {
    response.errors = err.serializeErrors();

    return res.status(err.statusCode).send(response);
  }

  res.status(400).send(response);
};

export { errorMiddleware };
