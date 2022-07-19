import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@tayfurerkenci/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if(!ticket){
      console.log('Ticket not found!');
      return;
      // throw new Error('Ticket not found');
    }

    const { title, price, version } = data;
    ticket.set({title, price, version});
    await ticket.save();

    msg.ack();
  }
}