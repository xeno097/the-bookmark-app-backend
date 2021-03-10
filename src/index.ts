import { app } from './app';
import { appConfig } from './config/app.config';

const start = () => {
  app.listen(appConfig.port, () => {
    console.log(`App is running at port ${appConfig.port}...`);
  });
};

start();
