import e from 'express';

export interface GqlCustomExecutionContext {
  req: e.Request;
  res: e.Response;
  auth: string;
}
