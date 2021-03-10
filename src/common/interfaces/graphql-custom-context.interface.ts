import { Request, Response } from 'express';

export interface GqlCustomExecutionContext {
  req: Request;
  res: Response;
  auth: string;
}
