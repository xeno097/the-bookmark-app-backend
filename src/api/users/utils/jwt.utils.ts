import jwt from 'jsonwebtoken';
import { AUTH_EXPIRATION_TIME } from '../../../common/constants';
import { IJwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { appConfig } from '../../../config/app.config';

export const generateToken = (userData: IJwtPayload) => {
  const token = jwt.sign(userData, appConfig.jwtSecret, {
    expiresIn: AUTH_EXPIRATION_TIME,
  });

  return token;
};
