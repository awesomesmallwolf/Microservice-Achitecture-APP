import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus, generateRandomMongoId } from "@tayfurerkenci/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a ticket
  const orderId = generateRandomMongoId();
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: generateRandomMongoId(),
  });

  ticket.set({ orderId });
  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
        id: ticket.id,
    }
  };

  // Create the fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg, orderId };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});