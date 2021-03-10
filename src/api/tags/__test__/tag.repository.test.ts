import { createTag } from '../tag.repository';

describe('Tag Repository', () => {
  describe('CreateTag', () => {
    it('throws an error if name is empty', async (done) => {
      const name = '';

      try {
        await createTag({ name });
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if two tags with the same name are created', async (done) => {
      const input = {
        name: 'nodejs',
      };

      try {
        const tag1 = await createTag(input);
        const tag2 = await createTag(input);
      } catch (err) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully creates a tag', async () => {
      const input = {
        name: 'nodejs',
      };

      const tag = await createTag(input);

      expect(tag.name).toEqual(input.name);
    });
  });
});
