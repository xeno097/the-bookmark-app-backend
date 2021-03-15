import { gql } from 'apollo-server-express';
import request from 'supertest';
import { app } from '../../../app';
import { UserModel } from '../database/user.entity';

describe('UserResolver', () => {
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

    afterEach(async () => {
      await UserModel.deleteMany({});
    });

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

    it('throws an error if the email is already in use', async () => {
      const user = await setup();

      const input = {
        username: 'test',
        password: '1234567890',
        confirmPassword: '1234567890',
        email: user.email,
      };

      const res = await request(app)
        .post('/graphql')
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
        .post('/graphql')
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
        .post('/graphql')
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
        .post('/graphql')
        .send({ query: SIGN_UP, variables: { input } });

      expect(res.body.errors).not.toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signUp).toBeDefined();
      expect(res.body.data.signUp.user.username).toEqual(input.username);
      expect(res.body.data.signUp.user.email).toEqual(input.email);
    });
  });
});
