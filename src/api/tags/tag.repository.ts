import { generateSlug } from '../../common/functions/generate-slug';
import { TagDocument, TagModel } from './database/tag.entity';

const getOneTag = () => {};

const getAllTags = () => {};

const createTag = async (input: { name: string }): Promise<TagDocument> => {
  const { name } = input;

  if (name.length === 0) {
    throw new Error("Name can't be empty");
  }

  const tag = TagModel.build({
    name,
    slug: generateSlug([name]),
  });

  await tag.save();

  return tag;
};

const updateTag = () => {};

const deleteTag = () => {};

export { getOneTag, getAllTags, createTag, updateTag, deleteTag };
