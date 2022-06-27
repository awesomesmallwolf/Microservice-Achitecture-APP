import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
})

// if callback mark as async, we must use next function
// or use express-async-errors npm package
// app.all('*', async (req, res, next) => {
//   next(new NotFoundError());
// })

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (error) {
   console.error(error); 
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  })

};

start();




