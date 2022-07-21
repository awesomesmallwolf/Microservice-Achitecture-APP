import { Subjects, Publisher, PaymentCreatedEvent } from "@tayfurerkenci/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}