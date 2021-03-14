import { IErrorPayload } from '../../common/interfaces/error-payload.interface';
import { InvalidUserInputError } from '../../errors/invalid-user-input.error';
import { UserDocument, UserModel } from './database/user.entity';
import { ISignUpInput } from './interfaces/sign-up-input.interface';

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

  const newUser = UserModel.build({
    email,
    password,
    username,
  });

  await newUser.save();

  return newUser;
};

export { signUp };
