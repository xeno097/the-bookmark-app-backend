import request from 'supertest';
import { app } from '../../../app';
import { AUTH_PROPERTY_KEY, GRAPHQL_ENDPOINT } from '../../../common/constants';
import { UserModel } from '../database/user.entity';
import { ISignInInput } from '../interfaces/sign-in-input.interface';
import { ISignUpInput } from '../interfaces/sign-up-input.interface';
import { signUp } from '../user.repository';

describe('UserResolver', () => {
  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  const SIGN_IN = `
      mutation($input: SignInInput!) {
        signIn(input: $input) {
          jwt
          user {
            username
            email
          }
        }
      }
    `;

  const SIGN_UP = `
      mutation($input: SignUpInput!) {
        signUp(input: $input) {
          jwt
          user {
            username
            email
          }
        }
      }
    `;

  const SELF_QUERY = `
      query{
        self{
          username
          email
        }
      }
    `;

  const SIGN_OUT_MUTATION = `
      mutation{
        signOut
      }
  `;

  describe('signUp', () => {
    const setup = async () => {
      const user = UserModel.build({
        email: 'test@test.com',
        password: '1234567890',
        username: 'testuser',
      });

      await user.save();

      return user;
    };

    it('throws an error if the email is already in use', async () => {
      const user = await setup();

      const input = {
        username: 'test',
        password: '1234567890',
        confirmPassword: '1234567890',
        email: user.email,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_UP, variables: { input } });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('throws an error if the username is already in use', async () => {
      const user = await setup();

      const input = {
        username: user.username,
        password: '1234567890',
        confirmPassword: '1234567890',
        email: 'testuser@email.com',
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_UP, variables: { input } });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('throws an error if the passwords do not match', async () => {
      const user = await setup();

      const input = {
        username: 'test',
        password: '12345678',
        confirmPassword: '1234567890',
        email: 'testuser2email.com',
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_UP, variables: { input } });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('returns the user data and a jwt token given a valid sign up input', async () => {
      const user = await setup();

      const input = {
        username: 'test',
        password: '1234567890',
        confirmPassword: '1234567890',
        email: 'testuser2email.com',
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_UP, variables: { input } });

      expect(res.body.errors).not.toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signUp).toBeDefined();
      expect(res.body.data.signUp.user.username).toEqual(input.username);
      expect(res.body.data.signUp.user.email).toEqual(input.email);
    });
  });

  describe('signIn', () => {
    const setup = async () => {
      const signUpInput: ISignUpInput = {
        username: 'test',
        password: '1234567890',
        confirmPassword: '1234567890',
        email: 'testuser@email.com',
      };

      const user = await signUp(signUpInput);

      return user;
    };

    const SIGN_IN = `
      mutation($input: SignInInput!) {
        signIn(input: $input) {
          jwt
          user {
            username
            email
          }
        }
      }
    `;

    it('throws an error if given a non existing username', async () => {
      const newUser = await setup();

      const input: ISignInInput = {
        password: '1234567809',
        username: 'test',
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN, variables: { input } });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('throws an error if given an invalid password', async () => {
      const newUser = await setup();

      const input: ISignInInput = {
        password: '1234567809',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN, variables: { input } });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('successfully signs in the user given a valid combination of username and password', async () => {
      const newUser = await setup();

      const input: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN, variables: { input } });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
    });
  });

  describe('self', () => {
    const setup = async () => {
      const signUpInput: ISignUpInput = {
        username: 'test',
        password: '1234567890',
        confirmPassword: '1234567890',
        email: 'testuser@email.com',
      };

      const user = await signUp(signUpInput);

      return user;
    };

    it('throws an error if a user is not logged in', async () => {
      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SELF_QUERY, variables: {} });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('throws an error if a user has an invalid token', async () => {
      const newUser = await setup();

      const input: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN, variables: { input } });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = '1cecegrii ';

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set(AUTH_PROPERTY_KEY, jwtToken)
        .send({
          query: SELF_QUERY,
          variables: {},
        });

      expect(loggedRes.body.errors).toBeDefined();
      expect(loggedRes.body.data).toBeNull();
    });

    it('successfully returns the user data if the user is logged in [jwt from cookie]', async () => {
      const newUser = await setup();

      const input: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN, variables: { input } });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;
      const loggedUserName = res.body.data.signIn.user.username;
      const loggerUserEmail = res.body.data.signIn.user.email;

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set('Cookie', [`${AUTH_PROPERTY_KEY}=${jwtToken}`])
        .send({
          query: SELF_QUERY,
          variables: {},
        });

      expect(loggedRes.body.errors).toBeUndefined();
      expect(loggedRes.body.data).toBeDefined();
      expect(loggedRes.body.data.self.email).toEqual(loggerUserEmail);
      expect(loggedRes.body.data.self.username).toEqual(loggedUserName);
    });

    it('successfully returns the user data if the user is logged in [jwt from headers]', async () => {
      const newUser = await setup();

      const input: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN, variables: { input } });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;
      const loggedUserName = res.body.data.signIn.user.username;
      const loggerUserEmail = res.body.data.signIn.user.email;

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set(AUTH_PROPERTY_KEY, `Bearer ${jwtToken}`)
        .send({
          query: SELF_QUERY,
          variables: {},
        });

      expect(loggedRes.body.errors).toBeUndefined();
      expect(loggedRes.body.data).toBeDefined();
      expect(loggedRes.body.data.self.email).toEqual(loggerUserEmail);
      expect(loggedRes.body.data.self.username).toEqual(loggedUserName);
    });
  });

  describe('signOut', () => {
    const setup = async () => {
      const signUpInput: ISignUpInput = {
        username: 'test',
        password: '1234567890',
        confirmPassword: '1234567890',
        email: 'testuser@email.com',
      };

      const user = await signUp(signUpInput);

      return user;
    };

    it('throws an error if the user is not logged in', async () => {
      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_OUT_MUTATION, variables: {} });

      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });

    it('successfully logs out the user', async () => {
      const newUser = await setup();

      const input: ISignInInput = {
        password: '1234567890',
        username: newUser.username,
      };

      const res = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_IN, variables: { input } });

      expect(res.body.errors).toBeUndefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signIn.jwt).toBeDefined();
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);
      expect(res.body.data.signIn.user.username).toEqual(newUser.username);
      expect(res.body.data.signIn.user.email).toEqual(newUser.email);

      const jwtToken = res.body.data.signIn.jwt;
      const loggedUserName = res.body.data.signIn.user.username;
      const loggerUserEmail = res.body.data.signIn.user.email;

      const loggedRes = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .set('Cookie', [`${AUTH_PROPERTY_KEY}=${jwtToken}`])
        .send({
          query: SELF_QUERY,
          variables: {},
        });

      expect(loggedRes.body.errors).toBeUndefined();
      expect(loggedRes.body.data).toBeDefined();
      expect(loggedRes.body.data.self.email).toEqual(loggerUserEmail);
      expect(loggedRes.body.data.self.username).toEqual(loggedUserName);

      const res1 = await request(app)
        .post(GRAPHQL_ENDPOINT)
        .send({ query: SIGN_OUT_MUTATION, variables: {} });

      expect(res1.body.errors).toBeUndefined();
      expect(res1.body.data).toBeDefined();
      expect(res1.body.data.signOut).toEqual(true);
    });
  });
});
