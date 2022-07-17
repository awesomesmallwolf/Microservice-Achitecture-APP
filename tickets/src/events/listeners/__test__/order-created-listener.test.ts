import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus, generateRandomMongoId } from "@tayfurerkenci/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: generateRandomMongoId()
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: generateRandomMongoId(),
    version: 0,
    status: OrderStatus.Created,
    userId: generateRandomMongoId(),
    expiresAt: 'asdasd',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  };

  // Create the fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg};
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);

});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});


it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // as jest.Mock for avoid @ts-ignore
  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});