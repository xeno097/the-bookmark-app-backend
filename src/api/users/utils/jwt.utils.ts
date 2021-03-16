import jwt from 'jsonwebtoken';
import { appConfig } from '../../../config/app.config';

export const AUTH_EXPIRATION_TIME = 60 * 60;

export const generateToken = (userData: { username: string; id: string }) => {
  const token = jwt.sign(userData, appConfig.jwtSecret, {
    expiresIn: AUTH_EXPIRATION_TIME,
  });

  return token;
};
