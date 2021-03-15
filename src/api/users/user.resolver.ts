import { GqlCustomExecutionContext } from '../../common/interfaces/graphql-custom-context.interface';
import { ISignUpInput } from './interfaces/sign-up-input.interface';
import { signUp as signUpRepo } from './user.repository';
import { generateToken } from './utils/jwt.utils';

const signUp = async (
  parent: any,
  args: { input: ISignUpInput },
  context: GqlCustomExecutionContext,
  info: any,
) => {
  const { input } = args;
  const { res } = context;

  const user = await signUpRepo(input);

  const jwt = generateToken({ id: user.id, username: user.username });

  res.cookie('authentication', jwt);

  return {
    jwt,
    user,
  };
};

export { signUp };
