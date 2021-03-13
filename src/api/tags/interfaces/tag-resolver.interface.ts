import { GqlCustomExecutionContext } from '../../../common/interfaces/graphql-custom-context.interface';
import { TagDocument } from '../database/tag.entity';
import { IGetOneTagInput } from './get-one-tag-input.interface';

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
