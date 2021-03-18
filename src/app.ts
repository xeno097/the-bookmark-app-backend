import express from 'express';
import { apolloServer } from './apollo/server.apollo';
import { NotFoundError } from './errors/not-found.error';
import { errorMiddleware } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

apolloServer.applyMiddleware({ app });

app.all('*', (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorMiddleware);

export { app };
