import mongoose from 'mongoose';

interface BuildUserInput {
  username: string;
  email: string;
  password: string;
}

export interface UserDocument extends mongoose.Document {
  username: string;
  email: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(input: BuildUserInput): UserDocument;
}

export const UserModelName = 'User';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: String,
      unique: String,
    },
    password: {
      type: String,
      required: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.build = (input: BuildUserInput) => {
  return new UserModel(input);
};

const UserModel = mongoose.model<UserDocument, UserModel>(
  UserModelName,
  userSchema,
);

export { UserModel };
