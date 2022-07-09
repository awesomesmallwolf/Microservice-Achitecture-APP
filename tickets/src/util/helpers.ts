import mongoose from 'mongoose';

export const generateRandomMongoId = () => {
  return new mongoose.Types.ObjectId().toHexString();
}