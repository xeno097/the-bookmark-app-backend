import { Request, Response } from 'express';
import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';

export const gqlContext = (ctx: {
  req: Request;
  res: Response;
}): GqlCustomExecutionContext => {
  const { req, res } = ctx;

  return {
    req,
    res,
    user: undefined,
  };
};
