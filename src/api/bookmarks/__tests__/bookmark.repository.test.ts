import { BookmarkModel } from '../database/bookmark.entity';
import mongoose from 'mongoose';
import { IGetOneBookmark } from '../interfaces/get-one-bookmark-input.interface';
import { deleteBookmark, getOneBookmark } from '../bookmark.repository';

describe('BookmarkRepository', () => {
  const createBookmarkSetup = async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const bookmark = BookmarkModel.build({
      name: 'test bookmark',
      tags: [],
      userId,
      description: 'a random description',
    });

    await bookmark.save();

    return bookmark;
  };

  afterEach(async () => {
    await BookmarkModel.deleteMany({});
  });

  describe('getOneBookmark', () => {
    it('throws an error if given an id it cannot find a bookmark', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IGetOneBookmark = {
        id,
      };

      try {
        await getOneBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if given a bookmark and a user id it cannot find a bookmark', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();
      const userId = mongoose.Types.ObjectId().toHexString();

      const input: IGetOneBookmark = {
        id,
        userId,
      };

      try {
        await getOneBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully returns a bookmark given a valid id', async () => {
      const testBookmark = await createBookmarkSetup();

      const input: IGetOneBookmark = {
        id: testBookmark.id,
      };

      const bookmark = await await getOneBookmark(input);

      expect(bookmark.id).toEqual(input.id);
    });

    it('successfully return a bookmark given a combination of a valid bookmark and user id', async () => {
      const testBookmark = await createBookmarkSetup();

      const input: IGetOneBookmark = {
        id: testBookmark.id,
        userId: testBookmark.userId,
      };

      const bookmark = await await getOneBookmark(input);

      expect(bookmark.id).toEqual(input.id);
      expect(bookmark.userId).toEqual(input.userId);
    });
  });

  describe('getAllBookmarks', () => {});

  describe('createBookmark', () => {});

  describe('updateBookmark', () => {});

  describe('deleteBookmark', () => {
    it('throws an error if given an id it cannot find a bookmark', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IGetOneBookmark = {
        id,
      };

      try {
        await deleteBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if given a bookmark and a user id it cannot find a bookmark', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();
      const userId = mongoose.Types.ObjectId().toHexString();

      const input: IGetOneBookmark = {
        id,
        userId,
      };

      try {
        await deleteBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully removes a bookmark given a valid id', async () => {
      let checkDb = await BookmarkModel.find();

      expect(checkDb.length).toEqual(0);

      const testBookmark = await createBookmarkSetup();

      checkDb = await BookmarkModel.find();

      expect(checkDb.length).toEqual(1);

      const input: IGetOneBookmark = {
        id: testBookmark.id,
      };

      const bookmark = await deleteBookmark(input);

      expect(bookmark.id).toEqual(input.id);

      checkDb = await BookmarkModel.find();

      expect(checkDb.length).toEqual(0);
    });

    it('successfully removes a bookmark given a combination of a valid bookmark and user id', async () => {
      let checkDb = await BookmarkModel.find();

      expect(checkDb.length).toEqual(0);

      const testBookmark = await createBookmarkSetup();

      checkDb = await BookmarkModel.find();

      expect(checkDb.length).toEqual(1);

      const input: IGetOneBookmark = {
        id: testBookmark.id,
        userId: testBookmark.userId,
      };

      const bookmark = await deleteBookmark(input);

      expect(bookmark.id).toEqual(input.id);
      expect(bookmark.userId).toEqual(input.userId);

      checkDb = await BookmarkModel.find();

      expect(checkDb.length).toEqual(0);
    });
  });
});
