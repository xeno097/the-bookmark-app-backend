import { GqlCustomExecutionContext } from '../../../common/interfaces/graphql-custom-context.interface';
import { TagDocument } from '../database/tag.entity';
import { ICreateTagInput } from './create-tag-input.interface';
import { IGetOneTagInput } from './get-one-tag-input.interface';
import { IUpdateTagInput } from './update-tag-input.interface';

export interface TagQueries {
  tag: (
    parent: any,
    args: { input: IGetOneTagInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<TagDocument>;
  tags: (
    parent: any,
    args: any,
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<TagDocument[]>;
}

export interface TagMutations {
  createTag: (
    parent: any,
    args: { input: ICreateTagInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<TagDocument>;
  updateTag: (
    parent: any,
    args: { input: IUpdateTagInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<TagDocument[]>;
  deleteTag: (
    parent: any,
    args: { input: IGetOneTagInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<TagDocument[]>;
}
