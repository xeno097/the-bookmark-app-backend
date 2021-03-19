import { NotFoundError } from '../../errors/not-found.error';
import { BookmarkDocument, BookmarkModel } from './database/bookmark.entity';
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

const deleteBookmark = async (input: IGetOneBookmark): Promise<any> => {
  const bookmark = await getOneBookmark(input);

  await BookmarkModel.findByIdAndDelete(bookmark.id);

  return bookmark;
};

export { getOneBookmark, deleteBookmark };
