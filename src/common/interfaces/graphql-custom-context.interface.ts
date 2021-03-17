import { Request, Response } from 'express';
import { IJwtPayload } from './jwt-payload.interface';

export interface GqlCustomExecutionContext {
  req: Request;
  res: Response;
  user?: IJwtPayload;
}
