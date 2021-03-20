import { BookmarkModel } from '../database/bookmark.entity';
import mongoose from 'mongoose';
import { IGetOneBookmark } from '../interfaces/get-one-bookmark-input.interface';
import {
  createBookmark,
  deleteBookmark,
  getAllBookmarks,
  getOneBookmark,
  updateBookmark,
} from '../bookmark.repository';
import { IFilterBookmarks } from '../interfaces/filter-bookmarks-input.interface';
import { ICreateBookmarkInput } from '../interfaces/create-bookmark-input.interface';
import { IUpdateBookmarkInput } from '../interfaces/update-bookmark-input.interface';

describe('BookmarkRepository', () => {
  const createBookmarkSetup = async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

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
      expect(bookmarks[0].url).toEqual(testBookmark0.url);

      expect(bookmarks[1].id).toEqual(testBookmark1.id);
      expect(bookmarks[1].userId).toEqual(testBookmark1.userId);
      expect(bookmarks[1].description).toEqual(testBookmark1.description);
      expect(bookmarks[1].url).toEqual(testBookmark1.url);

      expect(bookmarks[2].id).toEqual(testBookmark2.id);
      expect(bookmarks[2].userId).toEqual(testBookmark2.userId);
      expect(bookmarks[2].description).toEqual(testBookmark2.description);
      expect(bookmarks[2].url).toEqual(testBookmark2.url);
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

  describe('createBookmark', () => {
    it('throws an error if the name is empty', async (done) => {
      const userId = mongoose.Types.ObjectId().toHexString();

      const input: ICreateBookmarkInput = {
        name: '',
        tags: [],
        url: 'the url of the guide',
        userId,
      };

      try {
        await createBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if the userId is empty', async (done) => {
      const input: ICreateBookmarkInput = {
        name: 'a kubernetes guide',
        tags: [],
        url: 'the url of the guide',
        userId: '',
      };

      try {
        await createBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if the url is empty', async (done) => {
      const userId = mongoose.Types.ObjectId().toHexString();

      const input: ICreateBookmarkInput = {
        name: 'a kubernetes guide',
        tags: [],
        url: '',
        userId,
      };

      try {
        await createBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully creates a bookmark', async () => {
      const userId = mongoose.Types.ObjectId().toHexString();

      const input: ICreateBookmarkInput = {
        name: 'a kubernetes guide',
        tags: [],
        url: 'the url of the guide',
        userId,
      };

      const bookmark = await createBookmark(input);

      expect(bookmark.name).toEqual(input.name);
      expect(bookmark.url).toEqual(input.url);
      expect(bookmark.userId).toEqual(input.userId);
    });
  });

  describe('updateBookmark', () => {
    it('throws an error if given an id it does not find a bookmark', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();

      const input: IUpdateBookmarkInput = {
        filter: {
          id,
        },
        data: {
          name: 'a new name',
        },
      };

      try {
        await updateBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if given an id and a userId it does not find a bookmark', async (done) => {
      const id = mongoose.Types.ObjectId().toHexString();
      const userId = mongoose.Types.ObjectId().toHexString();

      const input: IUpdateBookmarkInput = {
        filter: {
          id,
          userId,
        },
        data: {
          name: 'a new name',
        },
      };

      try {
        await updateBookmark(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully updates a bookmark given an id', async () => {
      const bookmark = await createBookmarkSetup();

      const input: IUpdateBookmarkInput = {
        filter: {
          id: bookmark.id,
        },
        data: {
          name: 'a new name',
        },
      };

      const updatedBookmark = await updateBookmark(input);

      expect(updatedBookmark.id).toEqual(input.filter.id);
      expect(updatedBookmark.name).toEqual(input.data.name);
      expect(updatedBookmark.description).toEqual(bookmark.description);
      expect(updatedBookmark.userId).toEqual(bookmark.userId);
      expect(updatedBookmark.url).toEqual(bookmark.url);
    });

    it('successfully updates a bookmark given an id and a userId', async () => {
      const bookmark = await createBookmarkSetup();

      const input: IUpdateBookmarkInput = {
        filter: {
          id: bookmark.id,
          userId: bookmark.userId,
        },
        data: {
          name: 'a new name',
          description: 'a description for an updated bookmark',
        },
      };

      const updatedBookmark = await updateBookmark(input);

      expect(updatedBookmark.id).toEqual(input.filter.id);
      expect(updatedBookmark.userId).toEqual(input.filter.userId);
      expect(updatedBookmark.name).toEqual(input.data.name);
      expect(updatedBookmark.description).toEqual(input.data.description);
      expect(updatedBookmark.userId).toEqual(bookmark.userId);
      expect(updatedBookmark.url).toEqual(bookmark.url);
    });
  });

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
