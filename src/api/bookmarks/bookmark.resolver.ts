import { authorizeUser } from '../../common/functions/authorize-user';
import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { getOneBookmark } from './bookmark.repository';
import { IBookmarkQueries } from './interfaces/bookmark-resolver.interface';
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
  args: any,
  context: GqlCustomExecutionContext,
  info: any,
): Promise<any[]> => {
  return [];
};

const bookmarkQueries: IBookmarkQueries = {
  bookmark,
  bookmarks,
};

export { bookmarkQueries };
