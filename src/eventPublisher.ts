import { EventEmitter2 } from 'eventemitter2';
import { AppContext } from './appContext';

export class EventPublisher extends EventEmitter2
{
  public Name: string;

  public static Prefix: string = `${AppContext.AppName}.`;

  constructor(name: string)
  {
      super({ wildcard: true });
      this.Name = name;
  }

  public emit(event: string | string[], ...values: any[]): boolean
  {
      let eventSubject = event as string;
      if (!eventSubject.startsWith(EventPublisher.Prefix))
      {
        eventSubject = EventPublisher.Prefix + (event as string);
      }

      return super.emit(eventSubject, values);
  }
}
