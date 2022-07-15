import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@tayfurerkenci/common';
import { Order, OrderStatus } from '../models/order';
import { header } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, 
[
  header('orderId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Order Id must be provided')
], async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if(!order){
    throw new NotFoundError();
  }

  if(order.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // publishing an event saying this was cancelled!
  

  res.status(204).send(order);
});

export { router as deleteOrderRouter };