import { authorizeUser } from '../../common/functions/authorize-user';
import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { getAllBookmarks, getOneBookmark } from './bookmark.repository';
import { BookmarkDocument } from './database/bookmark.entity';
import {
  IBookmarkMutations,
  IBookmarkQueries,
} from './interfaces/bookmark-resolver.interface';
import { ICreateBookmarkInput } from './interfaces/create-bookmark-input.interface';
import { IFilterBookmarks } from './interfaces/filter-bookmarks-input.interface';
import { IGetOneBookmark } from './interfaces/get-one-bookmark-input.interface';
import { IUpdateBookmarkInput } from './interfaces/update-bookmark-input.interface';

const bookmark = async (
  parent: any,
  args: { input: IGetOneBookmark },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<any> => {
  const { user } = context;
  const validatedUser = authorizeUser(user);
  const { input } = args;

  input.userId = validatedUser.id;

  return await getOneBookmark(input);
};

const bookmarks = async (
  parent: any,
  args: { input: IFilterBookmarks },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<BookmarkDocument[]> => {
  const { user } = context;
  const validatedUser = authorizeUser(user);
  const { input } = args;

  const internalInput: IFilterBookmarks = {
    ...input,
    filter: {
      userId: validatedUser.id,
    },
  };

  const bookmarks = await getAllBookmarks(internalInput);

  return bookmarks;
};

const createBookmark = async (
  parent: any,
  args: { input: ICreateBookmarkInput },
  context: GqlCustomExecutionContext,
  info: any,
) => {};

const updateBookmark = async (
  parent: any,
  args: { input: IUpdateBookmarkInput },
  context: GqlCustomExecutionContext,
  info: any,
) => {};

const deleteBookmark = async (
  parent: any,
  args: { input: IGetOneBookmark },
  context: GqlCustomExecutionContext,
  info: any,
) => {};

const bookmarkQueries: IBookmarkQueries = {
  bookmark,
  bookmarks,
};

const bookmarkMutation: IBookmarkMutations = {
  createBookmark,
  updateBookmark,
  deleteBookmark,
};

export { bookmarkQueries, bookmarkMutation, deleteBookmark };
