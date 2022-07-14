import { Publisher, Subjects, TicketUpdatedEvent } from "@tayfurerkenci/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}