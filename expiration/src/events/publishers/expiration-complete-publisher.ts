import { Subjects, Publisher, ExpirationCompleteEvent } from "@tayfurerkenci/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}