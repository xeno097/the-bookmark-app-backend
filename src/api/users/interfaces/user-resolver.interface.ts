import { GqlCustomExecutionContext } from '../../../common/interfaces/graphql-custom-context.interface';
import { IAuthPayload } from './auth-payload.interface';
import { ISignInInput } from './sign-in-input.interface';
import { ISignUpInput } from './sign-up-input.interface';

export interface IUserQueries {
  self: (
    parent: any,
    args: any,
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<any>;
}

export interface IUserMutations {
  signUp: (
    parent: any,
    args: { input: ISignUpInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<IAuthPayload>;
  signIn: (
    parent: any,
    args: { input: ISignInInput },
    context: GqlCustomExecutionContext,
    info: any,
  ) => Promise<IAuthPayload>;
}
