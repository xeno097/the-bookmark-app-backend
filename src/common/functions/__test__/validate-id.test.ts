import { validateId } from '../validate-id';
import mongoose from 'mongoose';
import { InvalidIdFormatError } from '../../../errors/invalid-id-format.error';

describe('validateId', () => {
  it('throws an error if the given id is not a mongodb id', () => {
    const id = '';

    expect(() => validateId(id)).toThrow(new InvalidIdFormatError());
  });

  it('successfully validates a mongodb id', () => {
    const id = mongoose.Types.ObjectId().toHexString();

    const res = validateId(id);

    expect(res).toEqual(true);
  });
});
