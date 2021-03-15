import jwt from 'jsonwebtoken';
import { appConfig } from '../../../config/app.config';

export const generateToken = (userData: { username: string; id: string }) => {
  const token = jwt.sign(userData, appConfig.jwtSecret);

  return token;
};
