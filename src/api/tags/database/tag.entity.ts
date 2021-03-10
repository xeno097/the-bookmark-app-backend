import mongoose from 'mongoose';

interface BuildTagInput {
  name: string;
  slug: string;
}

interface TagDocument extends mongoose.Document {
  name: string;
  slug: string;
}

interface TagModel extends mongoose.Model<TagDocument> {
  build(input: BuildTagInput): TagDocument;
}

export const TagModelName = 'Tag';

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

tagSchema.statics.build = (input: BuildTagInput) => {
  return new TagModel(input);
};

const TagModel = mongoose.model<TagDocument, TagModel>(TagModelName, tagSchema);

export { TagModel };
