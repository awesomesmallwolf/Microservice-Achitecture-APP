import { Publisher, OrderCancelledEvent, Subjects } from "@tayfurerkenci/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}