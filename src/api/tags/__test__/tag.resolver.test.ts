import { createTestClient } from 'apollo-server-testing';
import { apolloServer } from '../../../apollo/server.apollo';
import { generateSlug } from '../../../common/functions/generate-slug';
import { TagModel } from '../database/tag.entity';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { IGetOneTagInput } from '../interfaces/get-one-tag-input.interface';
import { gql } from 'apollo-server-express';
import { ICreateTagInput } from '../interfaces/create-tag-input.interface';
import { IUpdateTagInput } from '../interfaces/update-tag-input.interface';

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

  describe('createTag', () => {
    const CREATE_TAG = gql`
      mutation($input: CreateTagInput!) {
        createTag(input: $input) {
          id
          name
          slug
        }
      }
    `;

    it('throws an error if the name property is empty', async () => {
      const input: ICreateTagInput = {
        name: '',
      };

      const mutationResult = await mutate({
        mutation: CREATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors?.length).toBeGreaterThan(0);
    });

    it('throws an error if a user attempts to create a tag with a name already in use', async () => {
      const tag = await setup();

      const input: ICreateTagInput = {
        name: tag.name,
      };

      const mutationResult = await mutate({
        mutation: CREATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors?.length).toBeGreaterThan(0);
    });

    it('successfully creates a tag given a valid input', async () => {
      const input: ICreateTagInput = {
        name: 'typescript',
      };

      const mutationResult = await mutate({
        mutation: CREATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors).toBeUndefined();
      expect(mutationResult.data).toBeDefined();

      const checkTag = await TagModel.findById(
        mutationResult.data.createTag.id,
      );

      expect(checkTag?.name).toEqual(input.name);
    });

    it('successfully creates two tags if the have a different name', async () => {
      const input: ICreateTagInput = {
        name: 'typescript',
      };

      const input1: ICreateTagInput = {
        name: 'nodejs',
      };

      const mutationResult = await mutate({
        mutation: CREATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors).toBeUndefined();
      expect(mutationResult.data).toBeDefined();

      const checkTag = await TagModel.findById(
        mutationResult.data.createTag.id,
      );

      expect(checkTag?.name).toEqual(input.name);

      const mutationResult1 = await mutate({
        mutation: CREATE_TAG,
        variables: { input: input1 },
      });

      expect(mutationResult1.errors).toBeUndefined();
      expect(mutationResult1.data).toBeDefined();

      const checkTag1 = await TagModel.findById(
        mutationResult1.data.createTag.id,
      );

      expect(checkTag1?.name).toEqual(input1.name);
    });
  });

  describe('updateTag', () => {
    const UPDATE_TAG = gql`
      mutation($input: UpdateTagInput!) {
        updateTag(input: $input) {
          id
          name
          slug
        }
      }
    `;

    it('throws an error if it cannot find the tag with the given id', async () => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IUpdateTagInput = {
        filter: { id },
        data: {
          name: 'a new name',
        },
      };

      const mutationResult = await mutate({
        mutation: UPDATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors).toBeDefined();
      expect(mutationResult.errors?.length).toBeGreaterThan(0);
    });

    it('throws an error if it cannot find the tag with the given slug', async () => {
      const slug = 'a-non-existing-slug';

      const input: IUpdateTagInput = {
        filter: { slug },
        data: {
          name: 'a new name',
        },
      };

      const mutationResult = await mutate({
        mutation: UPDATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors).toBeDefined();
      expect(mutationResult.errors?.length).toBeGreaterThan(0);
    });

    it('successfully updates a tag given an id of an already existing one and a valid name', async () => {
      const tag = await setup();

      const tags = await TagModel.find({});

      expect(tags.length).toBeGreaterThan(0);

      const input: IUpdateTagInput = {
        filter: { id: tag.id },
        data: {
          name: 'a new name',
        },
      };
      const expectedSlug = 'a-new-name';

      const mutationResult = await mutate({
        mutation: UPDATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors).toBeUndefined();
      expect(mutationResult.data).toBeDefined();
      expect(mutationResult.data.updateTag.id).toEqual(input.filter.id);
      expect(mutationResult.data.updateTag.name).toEqual(input.data.name);
      expect(mutationResult.data.updateTag.slug).toEqual(expectedSlug);
    });

    it('successfully updates a tag given a slug of an already existing one and a valid name', async () => {
      const tag = await setup();

      const tags = await TagModel.find({});

      expect(tags.length).toBeGreaterThan(0);

      const input: IUpdateTagInput = {
        filter: { slug: tag.slug },
        data: {
          name: 'a new name',
        },
      };
      const expectedSlug = 'a-new-name';

      const mutationResult = await mutate({
        mutation: UPDATE_TAG,
        variables: { input },
      });

      expect(mutationResult.errors).toBeUndefined();
      expect(mutationResult.data).toBeDefined();
      expect(mutationResult.data.updateTag.name).toEqual(input.data.name);
      expect(mutationResult.data.updateTag.slug).toEqual(expectedSlug);
    });
  });

  describe('deleteTag', () => {
    const DELETE_TAG = gql`
      mutation($input: GetOneTagInput!) {
        deleteTag(input: $input) {
          id
          name
          slug
        }
      }
    `;

    it("throws an error if it can't find the tag given a valid id", async () => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IGetOneTagInput = {
        id,
      };

      const queryResult = await query({
        query: DELETE_TAG,
        variables: { input },
      });

      expect(queryResult.errors?.length).toBeGreaterThan(0);
    });

    it("throws an error if it can't find the tag given a valid slug", async () => {
      const slug = 'a-non-existing-slug';

      const input: IGetOneTagInput = {
        slug,
      };

      const queryResult = await query({
        query: DELETE_TAG,
        variables: { input },
      });

      expect(queryResult.errors?.length).toBeGreaterThan(0);
    });

    it('successfully deletes a tag given a valid id', async () => {
      const testTag = await setup();

      const input: IGetOneTagInput = {
        id: testTag.id,
      };

      const queryResult = await query({
        query: DELETE_TAG,
        variables: { input },
      });

      expect(queryResult.data).toBeDefined();
      expect(queryResult.data.deleteTag.id).toEqual(testTag.id);
      expect(queryResult.data.deleteTag.slug).toEqual(testTag.slug);
      expect(queryResult.data.deleteTag.name).toEqual(testTag.name);
    });

    it('successfully deletes a tag given a valid slug', async () => {
      const testTag = await setup();

      const input: IGetOneTagInput = {
        slug: testTag.slug,
      };

      const queryResult = await query({
        query: DELETE_TAG,
        variables: { input },
      });

      expect(queryResult.data).toBeDefined();
      expect(queryResult.data.deleteTag.id).toEqual(testTag.id);
      expect(queryResult.data.deleteTag.slug).toEqual(testTag.slug);
      expect(queryResult.data.deleteTag.name).toEqual(testTag.name);
    });
  });
});
