import { generateRandomMongoId, OrderStatus } from '@tayfurerkenci/common';
import request from 'supertest';
import app from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import apiKey from '../../config/env';


// This is commented because I preferred more realistic test approach.
// jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signIn())
    .send({
      token: 'asdasd',
      orderId: generateRandomMongoId()
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: generateRandomMongoId(),
    userId: generateRandomMongoId(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signIn())
    .send({
      token: 'asdasd',
      orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = generateRandomMongoId();

  const order = Order.build({
    id: generateRandomMongoId(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signIn(userId))
    .send({
      orderId: order.id,
      token: 'asdasd'
    })
    .expect(400);

});

it('returns a 204 with valid inputs', async () => {
  const userId = generateRandomMongoId();

  const price = Math.floor(Math.random() * 10000);

  const order = Order.build({
    id: generateRandomMongoId(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signIn(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa'
    })
    .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => {
      return charge.amount === price * 100
    });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });

  expect(payment).not.toBeNull();

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(20*100);
  // expect(chargeOptions.currency).toEqual('usd');
});