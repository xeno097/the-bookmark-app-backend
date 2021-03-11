import { generateSlug } from '../generate-slug';

describe('generateSlug', () => {
  it('throws an error if an empty array is provided', (done) => {
    const input: string[] = [];

    try {
      const slug = generateSlug(input);
    } catch (error) {
      return done();
    }

    throw new Error('Test failed');
  });

  it('generates a slug given the correct input', () => {
    const input = ['some', 'strings', 'to', 'test', 'this', 'function'];
    const expectedResult = 'some-strings-to-test-this-function';

    const slug = generateSlug(input);

    expect(slug).toEqual(expectedResult);
  });

  it('generates two different slugs if the true flag is passed as second  argument to generateSlug', () => {
    const input: string[] = ['a', 'test', 'input'];

    const slug1 = generateSlug(input, true);
    const slug2 = generateSlug(input, true);

    expect(slug1).not.toEqual(slug2);
  });
});
