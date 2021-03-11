import slugify from 'slugify';
import { InvalidFunctionInputError } from '../../errors/invalid-input.error';

export const generateSlug = (input: string[], isUnique = false) => {
  if (input.length === 0) {
    throw new InvalidFunctionInputError();
  }

  return '';
};
