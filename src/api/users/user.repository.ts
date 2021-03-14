import { InvalidUserInputError } from '../../errors/invalid-user-input.error';
import { UserDocument, UserModel } from './database/user.entity';
import { ISignUpInput } from './interfaces/sign-up-input.interface';

const signUp = async (input: ISignUpInput): Promise<any> => {
  const { confirmPassword, email, password, username } = input;

  const checkEmail = await UserModel.findOne({ email });

  if (checkEmail) {
    throw new InvalidUserInputError();
  }

  const checkUserName = await UserModel.findOne({ username });

  if (checkUserName) {
    throw new InvalidUserInputError();
  }

  if (password !== confirmPassword) {
    throw new InvalidUserInputError();
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
