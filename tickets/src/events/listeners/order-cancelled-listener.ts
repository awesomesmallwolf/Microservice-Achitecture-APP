import { Listener, OrderCancelledEvent, Subjects } from "@tayfurerkenci/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName=queueGroupName;
  
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log("data");
    console.log(data);
    const ticket = await Ticket.findById(data.ticket.id);
    console.log("ticket");
    console.log(ticket);
    if(!ticket){
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });

    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version
    });

    msg.ack();
  }

}