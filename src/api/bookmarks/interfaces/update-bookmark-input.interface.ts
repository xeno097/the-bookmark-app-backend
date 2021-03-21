import { IGetOneBookmark } from './get-one-bookmark-input.interface';
import mongoose from 'mongoose';

export interface IUpdateBookmarkInput {
  filter: IGetOneBookmark;
  data: {
    name?: string;
    description?: string;
    tags?: mongoose.Types.ObjectId[];
  };
}
