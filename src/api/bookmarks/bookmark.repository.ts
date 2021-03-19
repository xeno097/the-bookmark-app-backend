import { NotFoundError } from '../../errors/not-found.error';
import { BookmarkDocument, BookmarkModel } from './database/bookmark.entity';
import { IFilterBookmarks } from './interfaces/filter-bookmarks-input.interface';
import { IGetOneBookmark } from './interfaces/get-one-bookmark-input.interface';

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

const deleteBookmark = async (
  input: IGetOneBookmark,
): Promise<BookmarkDocument> => {
  const bookmark = await getOneBookmark(input);

  await BookmarkModel.findByIdAndDelete(bookmark.id);

  return bookmark;
};

export { getOneBookmark, deleteBookmark, getAllBookmarks };
