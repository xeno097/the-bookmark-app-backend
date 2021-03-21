import mongoose from 'mongoose';

export interface ICreateBookmarkInput {
  name: string;
  description?: string;
  tags: mongoose.Types.ObjectId[];
  userId?: string;
  url: string;
}
