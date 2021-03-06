import {
  createTag,
  deleteTag,
  getAllTags,
  getOneTag,
  updateTag,
} from '../tag.repository';
import mongoose from 'mongoose';
import { TagModel } from '../database/tag.entity';
import { generateSlug } from '../../../common/functions/generate-slug';
import { IUpdateTagInput } from '../interfaces/update-tag-input.interface';
import crypto from 'crypto';

describe('Tag Repository', () => {
  const createTagSetup = async () => {
    const name = crypto.randomBytes(5).toString('hex');

    const tag = TagModel.build({
      name: name,
      slug: generateSlug([name]),
    });

    await tag.save();

    return tag;
  };

  afterEach(async () => {
    await TagModel.deleteMany({});
  });

  describe('getOneTag', () => {
    it('throws an error if neither an id or a slug are provided', async (done) => {
      const input = {};

      try {
        await getOneTag(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if it cannot find a tag', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();

      try {
        await getOneTag({ id });
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully returns a tag given a valid id', async () => {
      const tag = await createTagSetup();

      const foundTag = await getOneTag({ id: tag.id });

      expect(foundTag.id).toEqual(tag.id);
      expect(foundTag.name).toEqual(tag.name);
      expect(foundTag.slug).toEqual(tag.slug);
    });

    it('successfully returns a tag given a slug of an already created tag', async () => {
      const tag = await createTagSetup();

      const foundTag = await getOneTag({ slug: tag.slug });

      expect(foundTag.id).toEqual(tag.id);
      expect(foundTag.name).toEqual(tag.name);
      expect(foundTag.slug).toEqual(tag.slug);
    });

    it('successfully returns a tag given both an id and a slug of an already existing tag', async () => {
      const tag = await createTagSetup();

      const foundTag = await getOneTag({ id: tag.id, slug: tag.slug });

      expect(foundTag.id).toEqual(tag.id);
      expect(foundTag.name).toEqual(tag.name);
      expect(foundTag.slug).toEqual(tag.slug);
    });
  });

  describe('getAllTags', () => {
    it('returns an empty array if there are no entries in the db', async () => {
      const tags = await TagModel.find({});

      expect(tags.length).toEqual(0);

      const getAllTagsResult = await getAllTags();

      expect(getAllTagsResult.length).toEqual(0);
      expect(getAllTagsResult).toBeInstanceOf(Array);
    });

    it('returns an array that has the same length of the number of tags stored in the db', async () => {
      const tags = await TagModel.find({});

      expect(tags.length).toEqual(0);

      const tag = await createTagSetup();
      const tag1 = await createTagSetup();
      const tag2 = await createTagSetup();

      const getAllTagsResult = await getAllTags();

      expect(getAllTagsResult.length).toEqual(3);
      expect(getAllTagsResult).toBeInstanceOf(Array);
      expect(getAllTagsResult[0].id).toEqual(tag.id);
      expect(getAllTagsResult[1].id).toEqual(tag1.id);
      expect(getAllTagsResult[2].id).toEqual(tag2.id);
    });
  });

  describe('createTag', () => {
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
        await createTag(input);
        await createTag(input);
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

  describe('updateTag', () => {
    it('throws an error if given an id of a not exsting tag', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IUpdateTagInput = {
        filter: { id },
        data: {
          name: 'a new name',
        },
      };

      try {
        await updateTag(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if given an id of a not exsting tag', async (done) => {
      const slug = 'a-slug-that-does-not-belong-to-any-tag';

      const input: IUpdateTagInput = {
        filter: { slug },
        data: {
          name: 'a new name',
        },
      };

      try {
        await updateTag(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully updates a tag given an id of an already existing one', async () => {
      const tag = await createTagSetup();

      const tags = await TagModel.find({});

      expect(tags.length).toBeGreaterThan(0);

      const input: IUpdateTagInput = {
        filter: { id: tag.id },
        data: {
          name: 'a new name',
        },
      };

      const expectedSlug = 'a-new-name';

      await updateTag(input);
      const updatedTag = await TagModel.findById(tag.id);

      expect(updatedTag?.name).toEqual(input.data.name);
      expect(updatedTag?.slug).toEqual(expectedSlug);
    });

    it('successfully updates a tag given a slug of an already existing one', async () => {
      const tag = await createTagSetup();

      const tags = await TagModel.find({});

      expect(tags.length).toBeGreaterThan(0);

      const input: IUpdateTagInput = {
        filter: { slug: tag.slug },
        data: {
          name: 'a new name',
        },
      };
      const expectedSlug = 'a-new-name';

      await updateTag(input);
      const updatedTag = await TagModel.findById(tag.id);

      expect(updatedTag?.name).toEqual(input.data.name);
      expect(updatedTag?.slug).toEqual(expectedSlug);
    });
  });

  describe('deleteTag', () => {
    it("throws an error if it can't find the tag given a valid id", async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();

      try {
        await deleteTag({ id });
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it("throws an error if it can't find a tag given a slug", async (done) => {
      const slug = 'a-slug-of-a-non-existing-tag';

      try {
        await deleteTag({ slug });
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully deletes a tag given an id of an already existing tag', async () => {
      const tag = await createTagSetup();

      const tagsBeforeDelete = await TagModel.find({});

      expect(tagsBeforeDelete.length).toEqual(1);

      const deletedTag = await deleteTag({ id: tag.id });

      const tagsAfterDelete = await TagModel.find({});

      expect(tagsAfterDelete.length).toEqual(0);
      expect(deletedTag.id).toEqual(tag.id);
      expect(deletedTag.slug).toEqual(tag.slug);
    });

    it('successfully deletes a tag given a slug of an already existing tag', async () => {
      const tag = await createTagSetup();

      const tagsBeforeDelete = await TagModel.find({});

      expect(tagsBeforeDelete.length).toEqual(1);

      const deletedTag = await deleteTag({ slug: tag.slug });

      const tagsAfterDelete = await TagModel.find({});

      expect(tagsAfterDelete.length).toEqual(0);
      expect(deletedTag.id).toEqual(tag.id);
      expect(deletedTag.slug).toEqual(tag.slug);
    });
  });
});
