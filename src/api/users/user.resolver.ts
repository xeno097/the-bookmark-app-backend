import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { IAuthPayload } from './interfaces/auth-payload.interface';
import { ISignInInput } from './interfaces/sign-in-input.interface';
import { ISignUpInput } from './interfaces/sign-up-input.interface';
import {
  IUserMutations,
  IUserQueries,
} from './interfaces/user-resolver.interface';
import { signUp as signUpRepo, signIn as signInRepo } from './user.repository';
import { AUTH_EXPIRATION_TIME, generateToken } from './utils/jwt.utils';

const self = async (
  parent: any,
  args: any,
  context: GqlCustomExecutionContext,
  info: any,
) => {};

const signUp = async (
  parent: any,
  args: { input: ISignUpInput },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<IAuthPayload> => {
  const { input } = args;
  const { res } = context;

  const user = await signUpRepo(input);

  const jwt = generateToken({ id: user.id, username: user.username });

  const date = new Date();

  const expiresIn = date.setSeconds(date.getSeconds() + AUTH_EXPIRATION_TIME);

  res.cookie('authentication', jwt, {
    httpOnly: true,
    secure: false,
    expires: new Date(expiresIn),
  });

  return {
    jwt,
    user,
  };
};

const signIn = async (
  parent: any,
  args: { input: ISignInInput },
  context: GqlCustomExecutionContext,
  info: any,
): Promise<any> => {
  const { input } = args;
  const { res } = context;

  const user = await signInRepo(input);

  const jwt = generateToken({ id: user.id, username: user.username });

  const date = new Date();

  const expiresIn = date.setSeconds(date.getSeconds() + AUTH_EXPIRATION_TIME);

  res.cookie('authentication', jwt, {
    httpOnly: true,
    secure: false,
    expires: new Date(expiresIn),
  });

  return {
    jwt,
    user,
  };
};

const userQueries: IUserQueries = {
  self,
};

const userMutations: IUserMutations = {
  signUp,
  signIn,
};

export { userQueries, userMutations };
