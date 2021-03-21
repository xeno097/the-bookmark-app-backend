import { validateId } from '../../common/functions/validate-id';
import { IErrorPayload } from '../../common/interfaces/error-payload.interface';
import { InvalidUserInputError } from '../../errors/invalid-user-input.error';
import { NotFoundError } from '../../errors/not-found.error';
import { UserDocument, UserModel } from './database/user.entity';
import { IGetOneUser } from './interfaces/find-one-user-input.interface';
import { ISignInInput } from './interfaces/sign-in-input.interface';
import { ISignUpInput } from './interfaces/sign-up-input.interface';
import { PasswordManager } from './utils/password.util';

const getOneUser = async (input: IGetOneUser): Promise<UserDocument> => {
  const { id } = input;

  validateId(id);

  const user = await UserModel.findById(id);

  if (!user) {
    throw new NotFoundError();
  }

  return user;
};

const signUp = async (input: ISignUpInput): Promise<UserDocument> => {
  const { confirmPassword, email, password, username } = input;

  const errors: IErrorPayload[] = [];

  const checkEmail = await UserModel.findOne({ email });

  if (checkEmail) {
    errors.push({
      message: 'email already in use',
      field: 'email',
    });
  }

  const checkUserName = await UserModel.findOne({ username });

  if (checkUserName) {
    errors.push({
      message: 'username already in use',
      field: 'username',
    });
  }

  if (password !== confirmPassword) {
    errors.push({
      message: 'passwords do not match',
    });
  }

  if (errors.length > 0) {
    throw new InvalidUserInputError(errors);
  }

  const hashedPassword = await PasswordManager.toHash(password);

  const newUser = UserModel.build({
    email,
    password: hashedPassword,
    username,
  });

  await newUser.save();

  return newUser;
};

const signIn = async (input: ISignInInput): Promise<UserDocument> => {
  const { password, username } = input;

  const user = await UserModel.findOne({ username });

  if (!user) {
    throw new InvalidUserInputError();
  }

  const validatePassword = await PasswordManager.compare(
    user.password,
    password,
  );

  if (!validatePassword) {
    throw new InvalidUserInputError();
  }

  return user;
};

export { signUp, signIn, getOneUser };
