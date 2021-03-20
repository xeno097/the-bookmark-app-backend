import { authorizeUser } from '../../common/functions/authorize-user';
import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { getAllBookmarks, getOneBookmark } from './bookmark.repository';
import { BookmarkDocument } from './database/bookmark.entity';
import { IBookmarkQueries } from './interfaces/bookmark-resolver.interface';
import { IFilterBookmarks } from './interfaces/filter-bookmarks-input.interface';
import { IGetOneBookmark } from './interfaces/get-one-bookmark-input.interface';

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

const bookmarkQueries: IBookmarkQueries = {
  bookmark,
  bookmarks,
};

export { bookmarkQueries };
