import { UserModel } from '../database/user.entity';
import { ISignUpInput } from '../interfaces/sign-up-input.interface';
import { signUp } from '../user.repository';

describe('UserRepository', () => {
  const setup = async () => {
    const user = UserModel.build({
      email: 'test@test.com',
      password: '1234567890',
      username: 'testuser',
    });

    await user.save();

    return user;
  };

  describe('signUp', () => {
    it('throws an error if the email is already in use', async (done) => {
      const user = await setup();

      const input: ISignUpInput = {
        confirmPassword: '1234567890',
        password: '1234567890',
        email: user.email,
        username: 'user',
      };

      try {
        await signUp(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if the username is already is use', async (done) => {
      const user = await setup();

      const input: ISignUpInput = {
        confirmPassword: '1234567890',
        password: '1234567890',
        email: 'email@test.com',
        username: user.username,
      };

      try {
        await signUp(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('throws an error if the passwords do not match', async (done) => {
      const user = await setup();

      const input: ISignUpInput = {
        confirmPassword: '12345678',
        password: '1234567890',
        email: 'email@test.com',
        username: 'user',
      };

      try {
        await signUp(input);
      } catch (error) {
        return done();
      }

      throw new Error('Test failed');
    });

    it('successfully creates a user given a valid input', async () => {
      const input: ISignUpInput = {
        confirmPassword: '1234567890',
        password: '1234567890',
        email: 'user@test.com',
        username: 'newuser',
      };

      const user = await signUp(input);

      expect(user.username).toEqual(input.username);
      expect(user.email).toEqual(input.email);
    });
  });
});
