import { authorizeUser } from '../../common/functions/authorize-user';
import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import {
  getAllBookmarks,
  getOneBookmark,
  createBookmark as createBookmarkRepo,
  updateBookmark as updateBookmarkRepo,
  deleteBookmark as deleteBookmarkRepo,
} from './bookmark.repository';
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
): Promise<BookmarkDocument> => {
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
): Promise<BookmarkDocument> => {
  const { user } = context;
  const validatedUser = authorizeUser(user);
  const { input } = args;

  input.userId = validatedUser.id;

  const createdBookmark = await createBookmarkRepo(input);

  return createdBookmark;
};

const updateBookmark = async (
  parent: any,
  args: { input: IUpdateBookmarkInput },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<BookmarkDocument> => {
  const { user } = context;
  const validatedUser = authorizeUser(user);
  const { input } = args;

  input.filter.userId = validatedUser.id;

  const updatedBookmark = await updateBookmarkRepo(input);

  return updatedBookmark;
};

const deleteBookmark = async (
  parent: any,
  args: { input: IGetOneBookmark },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<BookmarkDocument> => {
  const { user } = context;
  const validatedUser = authorizeUser(user);
  const { input } = args;

  input.userId = validatedUser.id;

  const deletedBookmark = await deleteBookmarkRepo(input);

  return deletedBookmark;
};

const bookmarkQueries: IBookmarkQueries = {
  bookmark,
  bookmarks,
};

const bookmarkMutations: IBookmarkMutations = {
  createBookmark,
  updateBookmark,
  deleteBookmark,
};

export { bookmarkQueries, bookmarkMutations };
