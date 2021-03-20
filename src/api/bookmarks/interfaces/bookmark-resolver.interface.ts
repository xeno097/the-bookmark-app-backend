import { GqlCustomExecutionContext } from '../../../common/interfaces/graphql-custom-context.interface';
import { BookmarkDocument } from '../database/bookmark.entity';
import { ICreateBookmarkInput } from './create-bookmark-input.interface';
import { IFilterBookmarks } from './filter-bookmarks-input.interface';
import { IGetOneBookmark } from './get-one-bookmark-input.interface';
import { IUpdateBookmarkInput } from './update-bookmark-input.interface';

export interface IBookmarkQueries {
  bookmark: (
    parent: any,
    args: { input: IGetOneBookmark },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<BookmarkDocument>;
  bookmarks: (
    parent: any,
    args: { input: IFilterBookmarks },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<any[]>;
}

export interface IBookmarkMutations {
  createBookmark: (
    parent: any,
    args: { input: ICreateBookmarkInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<any>;
  updateBookmark: (
    parent: any,
    args: { input: IUpdateBookmarkInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<any>;
  deleteBookmark: (
    parent: any,
    args: { input: IGetOneBookmark },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<any>;
}
