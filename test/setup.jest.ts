import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoInMemoryDb: MongoMemoryServer;

beforeAll(async () => {
  mongoInMemoryDb = await new MongoMemoryServer();
  const dbUri = await mongoInMemoryDb.getUri();

  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

afterEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoInMemoryDb.stop();
  await mongoose.connection.close();
});
