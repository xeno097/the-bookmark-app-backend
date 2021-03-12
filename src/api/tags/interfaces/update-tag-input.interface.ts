import { IGetOneTagInput } from './get-one-tag-input.interface';

export interface IUpdateTagInput {
  filter: IGetOneTagInput;
  data: { name: string };
}
