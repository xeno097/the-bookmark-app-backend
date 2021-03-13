import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { TagDocument } from './database/tag.entity';
import { IGetOneTagInput } from './interfaces/get-one-tag-input.interface';
import { TagQueries } from './interfaces/tag-resolver.interface';
import { getOneTag } from './tag.repository';

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
  return [];
};

const tagQueries: TagQueries = {
  tag,
  tags,
};

export { tagQueries };
