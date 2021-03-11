import { generateSlug } from '../../common/functions/generate-slug';
import { InvalidFunctionInputError } from '../../errors/invalid-input.error';
import { NotFoundError } from '../../errors/not-found.error';
import { TagDocument, TagModel } from './database/tag.entity';
import { ICreateTagInput } from './interfaces/create-tag-input.interface';

const getOneTag = async (input: {
  id?: string;
  slug?: string;
}): Promise<TagDocument> => {
  const { id, slug } = input;

  if (!id && !slug) {
    throw new InvalidFunctionInputError();
  }

  let filterInput = {};

  if (id) {
    filterInput = { _id: id };
  }

  if (slug) {
    filterInput = { ...filterInput, slug };
  }

  const tag = await TagModel.findOne(filterInput);

  if (!tag) {
    throw new NotFoundError();
  }

  return tag;
};

const getAllTags = () => {};

const createTag = async (input: ICreateTagInput): Promise<TagDocument> => {
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
