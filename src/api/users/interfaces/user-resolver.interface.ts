import { GqlCustomExecutionContext } from '../../../common/interfaces/graphql-custom-context.interface';
import { UserDocument } from '../database/user.entity';
import { ISignUpInput } from './sign-up-input.interface';

export interface IUserMutations {
  signUp: (
    parent: any,
    args: { input: ISignUpInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<any>;
}
