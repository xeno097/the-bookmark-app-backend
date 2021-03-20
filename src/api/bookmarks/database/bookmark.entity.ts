import mongoose from 'mongoose';
import { TagDocument, TagModelName } from '../../tags/database/tag.entity';

interface BuildBookmarkInput {
  name: string;
  description?: string;
  tags: mongoose.Types.ObjectId[];
  url: string;
  userId: string;
}

export interface BookmarkDocument extends mongoose.Document {
  name: string;
  description?: string;
  tags: TagDocument[];
  userId: string;
  url: string;
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
      type: [{ type: mongoose.Types.ObjectId, ref: TagModelName }],
      default: [],
    },
    userId: {
      type: String,
      required: true,
    },
    url: {
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

bookmarkSchema.post('save', async function (doc, next) {
  await doc.populate('tags').execPopulate();

  next();
});

const BookmarkModel = mongoose.model<BookmarkDocument, BookmarkModel>(
  BookmarkModelName,
  bookmarkSchema,
);

export { BookmarkModel };
