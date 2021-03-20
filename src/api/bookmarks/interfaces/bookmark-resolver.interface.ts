import { GqlCustomExecutionContext } from '../../../common/interfaces/graphql-custom-context.interface';
import { ICreateBookmarkInput } from './create-bookmark-input.interface';
import { IGetOneBookmark } from './get-one-bookmark-input.interface';
import { IUpdateBookmarkInput } from './update-bookmark-input.interface';

export interface IBookmarkQueries {
  bookmark: (
    parent: any,
    args: { input: IGetOneBookmark },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<any>;
  bookmarks: (
    parent: any,
    args: any,
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
