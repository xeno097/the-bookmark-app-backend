import { NotFoundError } from '../../errors/not-found.error';
import { BookmarkModel } from './database/bookmark.entity';
import { IGetOneBookmark } from './interfaces/get-one-bookmark-input.interface';

const getOneBookmark = async (input: IGetOneBookmark): Promise<any> => {
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

export { getOneBookmark };
