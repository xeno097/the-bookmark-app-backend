import { generateSlug } from '../../common/functions/generate-slug';
import { validateId } from '../../common/functions/validate-id';
import { InvalidFunctionInputError } from '../../errors/invalid-function-input.error';
import { NotFoundError } from '../../errors/not-found.error';
import { TagDocument, TagModel } from './database/tag.entity';
import { ICreateTagInput } from './interfaces/create-tag-input.interface';
import { IGetOneTagInput } from './interfaces/get-one-tag-input.interface';
import { IUpdateTagInput } from './interfaces/update-tag-input.interface';

const getOneTag = async (input: IGetOneTagInput): Promise<TagDocument> => {
  const { id, slug } = input;

  if (!id && !slug) {
    throw new InvalidFunctionInputError();
  }

  let filterInput = {};

  if (id) {
    validateId(id);
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

const getAllTags = async (): Promise<TagDocument[]> => {
  const tags = await TagModel.find({});

  return tags;
};

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

const updateTag = async (input: IUpdateTagInput): Promise<TagDocument> => {
  const { data, filter } = input;

  const tag = await getOneTag(filter);

  const slug = generateSlug([data.name]);

  const updatePayload = { name: data.name, slug };

  tag.set(updatePayload);

  await tag.save();

  return tag;
};

const deleteTag = async (input: IGetOneTagInput): Promise<TagDocument> => {
  const tag = await getOneTag(input);

  await TagModel.findByIdAndDelete(tag.id);

  return tag;
};

export { getOneTag, getAllTags, createTag, updateTag, deleteTag };
