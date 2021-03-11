import slugify from 'slugify';

export const generateSlug = (input: string[], isUnique = false) => {
  if (input.length === 0) {
    throw new Error("Input can't be empty");
  }

  return '';
};
