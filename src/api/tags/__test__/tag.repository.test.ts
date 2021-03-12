import { createTag, getOneTag } from '../tag.repository';
import mongoose from 'mongoose';
import { TagModel } from '../database/tag.entity';
import { generateSlug } from '../../../common/functions/generate-slug';

describe('Tag Repository', () => {
  const setup = async () => {
    const tag = TagModel.build({
      name: 'nodejs',
      slug: generateSlug(['nodejs']),
    });

    await tag.save();

    return tag;
  };

  describe('GetOneTag', () => {
    it('throws an error if neither an id or a slug are provided', async (done) => {
      const input = {};

      try {
        const tag = await getOneTag(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if it cannot find a tag', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();

      try {
        const tag = await getOneTag({ id });
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully returns a tag given a valid id', async () => {
      const tag = await setup();

      const foundTag = await getOneTag({ id: tag.id });

      expect(foundTag.id).toEqual(tag.id);
      expect(foundTag.name).toEqual(tag.name);
      expect(foundTag.slug).toEqual(tag.slug);
    });

    it('it successfully returns a tag given a slug of an already created tag', async () => {
      const tag = await setup();

      const foundTag = await getOneTag({ slug: tag.slug });

      expect(foundTag.id).toEqual(tag.id);
      expect(foundTag.name).toEqual(tag.name);
      expect(foundTag.slug).toEqual(tag.slug);
    });

    it('successfully returns a tag given both an id and a slug of an already existing tag', async () => {
      const tag = await setup();

      const foundTag = await getOneTag({ id: tag.id, slug: tag.slug });

      expect(foundTag.id).toEqual(tag.id);
      expect(foundTag.name).toEqual(tag.name);
      expect(foundTag.slug).toEqual(tag.slug);
    });
  });

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

    it('successfully creates 2 tags if they have different names', async () => {
      const input = {
        name: 'nodejs',
      };

      const input2 = {
        name: 'typescript',
      };

      const tag1 = await createTag(input);
      const tag2 = await createTag(input2);

      expect(tag1.name).toEqual(input.name);
      expect(tag2.name).toEqual(input2.name);
    });
  });

  describe('deleteTag', () => {
    it("throws an error if it can't find the tag given a valid id", async () => {});

    it("throws an error if it can't find a tag given a slug", () => {});

    it('successfully deletes a tag given an id of an already existing tag', () => {});

    it('successfully deletes a tag given a slug of an already existing tag', () => {});
  });
});
