import dotenv from 'dotenv';

class AppConfig {
  readonly port: number;
  readonly dbConnectionString: string;
  readonly jwtSecret: string;

  constructor() {
    dotenv.config();

    this.port = Number(process.env.PORT) || 3000;
    this.dbConnectionString =
      process.env.DB_CONNECTION_STRING || 'localhost:27017';
    this.jwtSecret = process.env.JWT_SECRET || '';
  }
}

const appConfig = new AppConfig();

export { appConfig };
