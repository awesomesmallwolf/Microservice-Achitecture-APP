import mongoose from 'mongoose';
import app from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // first arg coming from nats-depl -cid (cluster id) parameter
    // url arg coming from nats service defined in nats-depl deployment file
    await natsWrapper.connect('ticketapp', 'asdas', 'http://nats-srv:4222');
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
   console.error(error); 
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  })

};

start();




