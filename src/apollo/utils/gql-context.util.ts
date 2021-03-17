import { Request, Response } from 'express';
import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app.config';

export const gqlContext = (ctx: {
  req: Request;
  res: Response;
}): GqlCustomExecutionContext => {
  const { req, res } = ctx;

  const jwtFromCookie = req?.cookies?.authorization;
  const authHeader = req?.headers?.authorization?.split(' ');

  const jwtFromHeader =
    authHeader && authHeader[0] === 'Bearer' ? authHeader[1] : null;

  const token = jwtFromCookie || jwtFromHeader;

  let user = undefined;

  try {
    user = jwt.verify(token, appConfig.jwtSecret) as IJwtPayload;
  } catch (error) {}

  return {
    req,
    res,
    user,
  };
};
