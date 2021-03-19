import { BookmarkModel } from '../database/bookmark.entity';
import mongoose from 'mongoose';
import { IGetOneBookmark } from '../interfaces/get-one-bookmark-input.interface';
import {
  deleteBookmark,
  getAllBookmarks,
  getOneBookmark,
} from '../bookmark.repository';
import { IFilterBookmarks } from '../interfaces/filter-bookmarks-input.interface';

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

  describe('getAllBookmarks', () => {
    it('returns an empty array if there are no bookmarks stored in the database', async () => {
      const bookmarks = await getAllBookmarks();

      expect(bookmarks.length).toEqual(0);
      expect(bookmarks).toBeInstanceOf(Array);
    });

    it('returns an array that contains all the bookmarks in the database', async () => {
      let bookmarks = await getAllBookmarks();

      expect(bookmarks.length).toEqual(0);
      expect(bookmarks).toBeInstanceOf(Array);

      const testBookmark0 = await createBookmarkSetup();
      const testBookmark1 = await createBookmarkSetup();
      const testBookmark2 = await createBookmarkSetup();

      bookmarks = await getAllBookmarks();

      expect(bookmarks.length).toEqual(3);
      expect(bookmarks).toBeInstanceOf(Array);
      expect(bookmarks[0].id).toEqual(testBookmark0.id);
      expect(bookmarks[0].userId).toEqual(testBookmark0.userId);
      expect(bookmarks[0].description).toEqual(testBookmark0.description);
      expect(bookmarks[1].id).toEqual(testBookmark1.id);

      expect(bookmarks[1].userId).toEqual(testBookmark1.userId);
      expect(bookmarks[1].description).toEqual(testBookmark1.description);
      expect(bookmarks[2].id).toEqual(testBookmark2.id);

      expect(bookmarks[2].userId).toEqual(testBookmark2.userId);
      expect(bookmarks[2].description).toEqual(testBookmark2.description);
    });

    it('returns an empty array if there are no results matching the given filter', async () => {
      const userId = mongoose.Types.ObjectId().toHexString();

      const input0: IFilterBookmarks = {
        limit: 5,
        start: 5,
      };

      const input1: IFilterBookmarks = {
        filter: {
          userId,
        },
      };

      let bookmarks = await getAllBookmarks(input0);

      expect(bookmarks.length).toEqual(0);
      expect(bookmarks).toBeInstanceOf(Array);

      bookmarks = await getAllBookmarks(input1);

      expect(bookmarks.length).toEqual(0);
      expect(bookmarks).toBeInstanceOf(Array);
    });

    it('returns an array of bookmarks that matches the given filter', async () => {
      await createBookmarkSetup();
      const testBookmark1 = await createBookmarkSetup();
      await createBookmarkSetup();

      const input0: IFilterBookmarks = {
        limit: 2,
      };

      const input1: IFilterBookmarks = {
        limit: 1,
        filter: {
          userId: testBookmark1.userId,
        },
      };

      let bookmarks = await getAllBookmarks(input0);

      expect(bookmarks.length).toEqual(input0.limit);
      expect(bookmarks).toBeInstanceOf(Array);

      bookmarks = await getAllBookmarks(input1);

      expect(bookmarks.length).toEqual(input1.limit);
      expect(bookmarks).toBeInstanceOf(Array);
      expect(bookmarks[0].userId).toEqual(input1.filter?.userId);
    });
  });

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
