import { Request, Response } from 'express';
import { AUTH_PROPERTY_KEY } from '../../common/constants';
import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app.config';

export const gqlContext = (ctx: {
  req: Request;
  res: Response;
}): GqlCustomExecutionContext => {
  const { req, res } = ctx;

  const jwtCookie = req.cookies[AUTH_PROPERTY_KEY];
  const jwtHeader = req.headers.authorization?.split(' ')[1];

  const token = jwtCookie || jwtHeader;

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
