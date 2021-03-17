import { UnauthorizedError } from '../../errors/unauthorized.error';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export const authorizeUser = (user?: IJwtPayload): IJwtPayload => {
  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
};
