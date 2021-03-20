import { UserModel } from '../../users/database/user.entity';
import { ISignUpInput } from '../../users/interfaces/sign-up-input.interface';
import { signUp } from '../../users/user.repository';
import { BookmarkModel } from '../database/bookmark.entity';
import { IGetOneBookmark } from '../interfaces/get-one-bookmark-input.interface';
import mongoose from 'mongoose';
import request from 'supertest';
import { AUTH_PROPERTY_KEY, GRAPHQL_ENDPOINT } from '../../../common/constants';
import { app } from '../../../app';
import { ISignInInput } from '../../users/interfaces/sign-in-input.interface';
import { TagModel } from '../../tags/database/tag.entity';
import { generateSlug } from '../../../common/functions/generate-slug';
import crypto from 'crypto';
import { IFilterBookmarks } from '../interfaces/filter-bookmarks-input.interface';

describe('BookmarkResolver', () => {
  afterEach(async () => {
    await BookmarkModel.deleteMany({});
    await UserModel.deleteMany({});
    await TagModel.deleteMany({});
  });

  const createBookmarkSetup = async (userId?: string) => {
    userId = userId || mongoose.Types.ObjectId().toHexString();

    const bookmark = BookmarkModel.build({
      name: 'test bookmark',
      tags: [],
      userId,
      url: 'a url for the bookmark',
      description: 'a random description',
    });

    await bookmark.save();

    return bookmark;
  };

  const createTagSetup = async () => {
    const name = crypto.randomBytes(5).toString('hex');

    const tag = TagModel.build({
      name: name,
      slug: generateSlug([name]),
    });

    await tag.save();

    return tag;
  };

  const signUpUserSetup = async () => {
    const signUpInput: ISignUpInput = {
      username: 'test',
      password: '1234567890',
      confirmPassword: '1234567890',
      email: 'testuser@email.com',
    };

    const user = await signUp(signUpInput);

    return user;
  };

  const SIGN_IN_MUTATION = `
      mutation($input: SignInInput!) {
        signIn(input: $input) {
          jwt
          user {
            username
            email
          }
        }
      }
    `;

  const BOOKMARK_QUERY = `
      query($input: GetOneBookmarkInput!){
        bookmark(input:$input){
            id
            name
            description
            tags{
                id
                name
                slug
            }
            url
        }
      }
    `;

  const BOOKMARKS_QUERY = `
      query($input: FilterBookmarksInput){
        bookmarks(input:$input){
            id
            name
            description
            tags{
                id
                name
                slug
            }
            url
          }
      }
    `;

  describe('bookmark', () => {
    it('throws an error if the user is not logged in', async () => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IGetOneBookmark = {
        id,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: BOOKMARK_QUERY, variables: { input } });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('throws an error if given an id it cannot find a bookmark', async () => {
      const newUser = await signUpUserSetup();
      const id = mongoose.Types.ObjectId().toHexString();

      const loginInput: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN_MUTATION, variables: { input: loginInput } });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;

      const input: IGetOneBookmark = {
        id,
      };

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set('Cookie', [`${AUTH_PROPERTY_KEY}=${jwtToken}`])
        .send({
          query: BOOKMARK_QUERY,
          variables: { input },
        });

      expect(loggedRes.body.errors).toBeDefined();
      expect(loggedRes.body.data).toBeNull();
    });

    it('successfully returns a bookmark if the user is logged and the id is valid', async () => {
      const newUser = await signUpUserSetup();
      const bookmark = await createBookmarkSetup(newUser.id);

      const loginInput: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: SIGN_IN_MUTATION,
          variables: { input: loginInput },
        });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;

      const input: IGetOneBookmark = {
        id: bookmark.id,
      };

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set('Cookie', [`${AUTH_PROPERTY_KEY}=${jwtToken}`])
        .send({
          query: BOOKMARK_QUERY,
          variables: { input },
        });

      expect(loggedRes.body.errors).toBeUndefined();
      expect(loggedRes.body.data).toBeDefined();
      expect(loggedRes.body.data.bookmark.id).toEqual(bookmark.id);
      expect(loggedRes.body.data.bookmark.name).toEqual(bookmark.name);
      expect(loggedRes.body.data.bookmark.description).toEqual(
        bookmark.description,
      );
      expect(loggedRes.body.data.bookmark.url).toEqual(bookmark.url);
    });
  });

  describe('bookmarks', () => {
    it('throws an error if the user is not logged in', async () => {
      const input: IFilterBookmarks = {};

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: BOOKMARKS_QUERY, variables: { input } });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it("returns an empty array if there aren't bookmarks that belong to the user in the db", async () => {
      const newUser = await signUpUserSetup();

      const loginInput: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: SIGN_IN_MUTATION,
          variables: { input: loginInput },
        });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;

      const input: IFilterBookmarks = {};

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set('Cookie', [`${AUTH_PROPERTY_KEY}=${jwtToken}`])
        .send({
          query: BOOKMARKS_QUERY,
          variables: { input },
        });

      expect(loggedRes.body.errors).toBeUndefined();
      expect(loggedRes.body.data).toBeDefined();
    });

    it('returns all the bookmarks that belong to the user', async () => {
      const newUser = await signUpUserSetup();
      const bookmark1 = await createBookmarkSetup(newUser.id);
      const bookmark2 = await createBookmarkSetup(newUser.id);

      const loginInput: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: SIGN_IN_MUTATION,
          variables: { input: loginInput },
        });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;

      const input: IFilterBookmarks = {};

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set('Cookie', [`${AUTH_PROPERTY_KEY}=${jwtToken}`])
        .send({
          query: BOOKMARKS_QUERY,
          variables: { input },
        });

      expect(loggedRes.body.errors).toBeUndefined();
      expect(loggedRes.body.data).toBeDefined();
      expect(loggedRes.body.data.bookmarks.length).toEqual(2);
      expect(loggedRes.body.data.bookmarks[0].id).toEqual(bookmark1.id);
      expect(loggedRes.body.data.bookmarks[1].id).toEqual(bookmark2.id);
    });

    it('returns an array of one bookmark that belongs to the user', async () => {
      const newUser = await signUpUserSetup();
      const bookmark1 = await createBookmarkSetup(newUser.id);
      await createBookmarkSetup(newUser.id);

      const loginInput: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: SIGN_IN_MUTATION,
          variables: { input: loginInput },
        });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;

      const input: IFilterBookmarks = {
        limit: 1,
      };

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set('Cookie', [`${AUTH_PROPERTY_KEY}=${jwtToken}`])
        .send({
          query: BOOKMARKS_QUERY,
          variables: { input },
        });

      expect(loggedRes.body.errors).toBeUndefined();
      expect(loggedRes.body.data).toBeDefined();
      expect(loggedRes.body.data.bookmarks.length).toEqual(1);
      expect(loggedRes.body.data.bookmarks[0].id).toEqual(bookmark1.id);
    });
  });
});
