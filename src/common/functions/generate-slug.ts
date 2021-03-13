import slugify from 'slugify';
import { InvalidFunctionInputError } from '../../errors/invalid-input.error';
import { randomBytes } from 'crypto';

export const generateSlug = (input: string[], isUnique = false) => {
  if (input.length === 0) {
    throw new InvalidFunctionInputError();
  }

  if (isUnique) {
    const salt = randomBytes(5).toString('hex');
    input.push(salt);
  }

  const slugifyInput = input.join(' ');

  const slug = slugify(slugifyInput, {
    lower: true,
  });

  return slug;
};
