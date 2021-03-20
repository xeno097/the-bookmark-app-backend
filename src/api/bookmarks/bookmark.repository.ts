import { IErrorPayload } from '../../common/interfaces/error-payload.interface';
import { InvalidFunctionInputError } from '../../errors/invalid-function-input.error';
import { InvalidUserInputError } from '../../errors/invalid-user-input.error';
import { NotFoundError } from '../../errors/not-found.error';
import { BookmarkDocument, BookmarkModel } from './database/bookmark.entity';
import { ICreateBookmarkInput } from './interfaces/create-bookmark-input.interface';
import { IFilterBookmarks } from './interfaces/filter-bookmarks-input.interface';
import { IGetOneBookmark } from './interfaces/get-one-bookmark-input.interface';
import { IUpdateBookmarkInput } from './interfaces/update-bookmark-input.interface';

const getOneBookmark = async (
  input: IGetOneBookmark,
): Promise<BookmarkDocument> => {
  const { id, userId } = input;

  let filter = {};

  if (id) {
    filter = { _id: id };
  }

  if (userId) {
    filter = { ...filter, userId };
  }

  const bookmark = await BookmarkModel.findOne(filter);

  if (!bookmark) {
    throw new NotFoundError();
  }

  return bookmark;
};

const getAllBookmarks = async (
  input: IFilterBookmarks = {},
): Promise<any[]> => {
  const { filter, limit, start } = input;

  const bookmarks = BookmarkModel.find();

  if (start) {
    bookmarks.skip(start);
  }

  if (limit) {
    bookmarks.limit(limit);
  }

  if (filter && filter.userId) {
    const { userId } = filter;

    bookmarks.where({ userId });
  }

  await bookmarks.exec();

  return bookmarks;
};

const createBookmark = async (
  input: ICreateBookmarkInput,
): Promise<BookmarkDocument> => {
  const { name, tags, url, userId, description } = input;

  const errors: IErrorPayload[] = [];

  if (!name) {
    errors.push({
      message: 'name cannot be empty',
      field: 'name',
    });
  }

  if (!userId) {
    throw new InvalidFunctionInputError();
  }

  if (!url) {
    errors.push({
      message: 'url cannot be empty',
      field: 'url',
    });
  }

  if (errors.length !== 0) {
    throw new InvalidUserInputError(errors);
  }

  const bookmark = BookmarkModel.build({
    name,
    tags,
    url,
    userId,
    description,
  });

  await bookmark.save();

  return bookmark;
};

const updateBookmark = async (
  input: IUpdateBookmarkInput,
): Promise<BookmarkDocument> => {
  const { data, filter } = input;

  const bookmarkToUpdate = await getOneBookmark(filter);

  bookmarkToUpdate.set(data);

  await bookmarkToUpdate.save();

  return bookmarkToUpdate;
};

const deleteBookmark = async (
  input: IGetOneBookmark,
): Promise<BookmarkDocument> => {
  const bookmark = await getOneBookmark(input);

  await BookmarkModel.findByIdAndDelete(bookmark.id);

  return bookmark;
};

export {
  getOneBookmark,
  deleteBookmark,
  getAllBookmarks,
  createBookmark,
  updateBookmark,
};
