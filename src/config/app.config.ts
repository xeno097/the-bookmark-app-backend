import dotenv from 'dotenv';

class AppConfig {
  readonly port: number;
  readonly dbConnectionString: string;

  constructor() {
    dotenv.config();

    this.port = 3000;
    this.dbConnectionString = process.env.DB_CONNECTION_STRING || '';
  }
}

const appConfig = new AppConfig();

export { appConfig };
