import { app } from './app';
import { appConfig } from './config/app.config';
import mongoose from 'mongoose';

const start = async () => {
  await mongoose.connect(appConfig.dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  console.log('Connected to the database');

  app.listen(appConfig.port, () => {
    console.log(`App is running at port ${appConfig.port}...`);
  });
};

start();
