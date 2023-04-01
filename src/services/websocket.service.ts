import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, Subject, switchAll, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';

const WS_ENDPOINT = '';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$?: WebSocketSubject<unknown>;
  private messagesSubject$ = new Subject<Observable<unknown>>();
  readonly messages$: Observable<unknown> = this.messagesSubject$.pipe(switchAll(), catchError(e => {
    throw e;
  }));

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(WS_ENDPOINT);
      const messages = this.socket$.pipe(
        tap({
          error: error => console.log(error),
        }), catchError(e => {
          console.error(e);
          return EMPTY;
        }));
      this.messagesSubject$.next(messages);
    }
  }

  sendMessage(msg: unknown): void {
    this.socket$?.next(msg);
  }

  close(): void {
    this.socket$?.complete();
  }
}
