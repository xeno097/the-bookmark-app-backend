import { createTestClient } from 'apollo-server-testing';
import { apolloServer } from '../../../apollo/server.apollo';
import { generateSlug } from '../../../common/functions/generate-slug';
import { TagModel } from '../database/tag.entity';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { IGetOneTagInput } from '../interfaces/get-one-tag-input.interface';
import { gql } from 'apollo-server-express';

describe('TagResolver', () => {
  const { mutate, query } = createTestClient(apolloServer);
  const setup = async () => {
    const name = crypto.randomBytes(5).toString('hex');

    const tag = TagModel.build({
      name: name,
      slug: generateSlug([name]),
    });

    await tag.save();

    return tag;
  };

  describe('tag', () => {
    const TAG_QUERY = gql`
      query($input: GetOneTagInput!) {
        tag(input: $input) {
          id
          name
          slug
        }
      }
    `;

    it('throws an error if given an id does not find a tag', async () => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IGetOneTagInput = {
        id,
      };

      const queryResult = await query({
        query: TAG_QUERY,
        variables: { input },
      });

      expect(queryResult.errors?.length).toBeGreaterThan(0);
    });

    it('throws an error if given a slug does not find a tag', async () => {
      const slug = 'a-slug-that-does-not-exist';

      const input: IGetOneTagInput = {
        id: slug,
      };

      const queryResult = await query({
        query: TAG_QUERY,
        variables: { input },
      });

      expect(queryResult.errors?.length).toBeGreaterThan(0);
    });

    it('returns a tag if given an id of an already existing one', async () => {
      const testTag = await setup();

      const input: IGetOneTagInput = {
        id: testTag.id,
      };

      const queryResult = await query({
        query: TAG_QUERY,
        variables: { input },
      });

      expect(queryResult.data).toBeDefined();
      expect(queryResult.data.tag.id).toEqual(testTag.id);
      expect(queryResult.data.tag.slug).toEqual(testTag.slug);
      expect(queryResult.data.tag.name).toEqual(testTag.name);
    });

    it('returns a tag if given a slug of an already existing one', async () => {
      const testTag = await setup();

      const input: IGetOneTagInput = {
        slug: testTag.slug,
      };

      const queryResult = await query({
        query: TAG_QUERY,
        variables: { input },
      });

      expect(queryResult.data).toBeDefined();
      expect(queryResult.data.tag.id).toEqual(testTag.id);
      expect(queryResult.data.tag.slug).toEqual(testTag.slug);
      expect(queryResult.data.tag.name).toEqual(testTag.name);
    });
  });

  describe('tags', () => {
    const TAGS_QUERY = gql`
      query {
        tags {
          id
          name
          slug
        }
      }
    `;

    it('returns an empty array if there are no tags in the databse', async () => {
      const tags = await TagModel.find({});

      expect(tags.length).toEqual(0);

      const queryResult = await query({
        query: TAGS_QUERY,
      });

      expect(queryResult.errors).toBeUndefined();
      expect(queryResult.data).toBeDefined();
      expect(queryResult.data.tags.length).toEqual(0);
      expect(queryResult.data.tags).toBeInstanceOf(Array);
    });

    it('returns all the tags created in the database', async () => {
      const tags = await TagModel.find({});

      expect(tags.length).toEqual(0);

      const tag = await setup();
      const tag1 = await setup();
      const tag2 = await setup();

      const queryResult = await query({
        query: TAGS_QUERY,
      });

      expect(queryResult.errors).toBeUndefined();
      expect(queryResult.data).toBeDefined();
      expect(queryResult.data.tags.length).toEqual(3);
      expect(queryResult.data.tags[0].id).toEqual(tag.id);
      expect(queryResult.data.tags[1].id).toEqual(tag1.id);
      expect(queryResult.data.tags[2].id).toEqual(tag2.id);
      expect(queryResult.data.tags).toBeInstanceOf(Array);
    });
  });
});
