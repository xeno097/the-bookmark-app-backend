import mongoose from 'mongoose';
import { InvalidIdFormatError } from '../../errors/invalid-id-format.error';

export const validateId = (id: string) => {
  const checkResult = mongoose.isValidObjectId(id);

  if (!checkResult) {
    throw new InvalidIdFormatError();
  }

  return checkResult;
};
