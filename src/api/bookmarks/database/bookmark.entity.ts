import mongoose from 'mongoose';
import { TagDocument, TagModelName } from '../../tags/database/tag.entity';

interface BuildBookmarkInput {
  name: string;
  description?: string;
  tags: TagDocument[];
  userId: string;
}

interface BookmarkDocument extends mongoose.Document {
  name: string;
  description?: string;
  tags: TagDocument[];
  userId: string;
}

interface BookmarkModel extends mongoose.Model<BookmarkDocument> {
  build(input: BuildBookmarkInput): BookmarkDocument;
}

export const BookmarkModelName = 'Bookmark';

const bookmarkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    tags: {
      type: [mongoose.Types.ObjectId],
      default: [],
      ref: TagModelName,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

bookmarkSchema.statics.build = (input: BuildBookmarkInput) => {
  return new BookmarkModel(input);
};

const BookmarkModel = mongoose.model<BookmarkDocument, BookmarkModel>(
  BookmarkModelName,
  bookmarkSchema,
);

export { BookmarkModel };
