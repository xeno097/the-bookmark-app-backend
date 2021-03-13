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
});
