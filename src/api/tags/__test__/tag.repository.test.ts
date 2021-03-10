import { createTag } from '../tag.repository';

describe('Tag Repository', () => {
  describe('CreateTag', () => {
    it('throws an error if name is empty', async () => {
      const name = '';

      expect(async () => await createTag({ name })).toThrow();
    });
  });
});
