import mongoose, { mongo } from 'mongoose';
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
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoInMemoryDb.stop();
  await mongoose.connection.close();
});
