import { Request, Response } from 'express';

export interface GqlCustomExecutionContext {
  req: Request;
  res: Response;
  user?: {
    username: string;
    email: string;
  };
}
