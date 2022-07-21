import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { generateRandomMongoId, OrderCreatedEvent, OrderStatus } from "@tayfurerkenci/common";
import { Message } from 'node-nats-streaming';
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: generateRandomMongoId(),
    version: 0,
    expiresAt: 'asdasdasd',
    userId: generateRandomMongoId(),
    status: OrderStatus.Created,
    ticket: {
      id: generateRandomMongoId(),
      price: 10
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

});