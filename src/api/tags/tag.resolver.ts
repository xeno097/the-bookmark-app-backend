import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { TagDocument } from './database/tag.entity';
import { ICreateTagInput } from './interfaces/create-tag-input.interface';
import { IGetOneTagInput } from './interfaces/get-one-tag-input.interface';
import { TagQueries } from './interfaces/tag-resolver.interface';
import { getAllTags, getOneTag } from './tag.repository';

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
) => {};

const tagQueries: TagQueries = {
  tag,
  tags,
};

export { tagQueries };
