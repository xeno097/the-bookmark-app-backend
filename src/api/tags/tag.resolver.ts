import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { TagDocument } from './database/tag.entity';
import { ICreateTagInput } from './interfaces/create-tag-input.interface';
import { IGetOneTagInput } from './interfaces/get-one-tag-input.interface';
import { TagMutations, TagQueries } from './interfaces/tag-resolver.interface';
import { IUpdateTagInput } from './interfaces/update-tag-input.interface';
import {
  getAllTags,
  getOneTag,
  createTag as createTagRepo,
  updateTag as updateTagRepo,
  deleteTag as deleteTagRepo,
} from './tag.repository';

const tag = async (
  parent: any,
  args: { input: IGetOneTagInput },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<TagDocument> => {
  const { input } = args;

  return await getOneTag(input);
};

const tags = async (
  parent: any,
  args: IGetOneTagInput,
  context: GqlCustomExecutionContext,
  info: any,
): Promise<TagDocument[]> => {
  return await getAllTags();
};

const createTag = async (
  parent: any,
  args: { input: ICreateTagInput },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<TagDocument> => {
  const { input } = args;

  return await createTagRepo(input);
};

const updateTag = async (
  parent: any,
  args: { input: IUpdateTagInput },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<TagDocument> => {
  const { input } = args;

  return await updateTagRepo(input);
};

const deleteTag = async (
  parent: any,
  args: { input: IGetOneTagInput },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<TagDocument> => {
  const { input } = args;

  return await deleteTagRepo(input);
};

const tagQueries: TagQueries = {
  tag,
  tags,
};

const tagMutations: TagMutations = {
  createTag,
  updateTag,
  deleteTag,
};

export { tagQueries, tagMutations };
