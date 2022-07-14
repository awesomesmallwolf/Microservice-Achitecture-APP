import request  from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';
import jwt from 'jsonwebtoken';
import { generateRandomMongoId } from '../util/helpers';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): string[];
//     }
//   }
// }

declare global {
  var signIn: () => string[];
}

jest.mock('../nats-wrapper.ts');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "tayfur";

  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections)
  {
    await collection.deleteMany({});
  }

});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});


global.signIn = () => {
  // Build a JWT payload -> { id, email }
  const payload = {
    id: generateRandomMongoId(),
    email: 'test@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};