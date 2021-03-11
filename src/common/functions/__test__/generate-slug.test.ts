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
});
