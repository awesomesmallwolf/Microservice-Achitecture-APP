import { Publisher, Subjects, TicketCreatedEvent } from "@tayfurerkenci/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}