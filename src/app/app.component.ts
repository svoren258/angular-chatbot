import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, scan, Subject, tap } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';

@Component({
  standalone: true,
  imports: [RouterModule, AsyncPipe, NgIf, FormsModule, NgForOf],
  selector: 'angular-chatbot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  ngModelOptions = {
    standalone: true
  };
  readonly messages$ = this.websocketService.messages$.pipe(
    tap({next: (next) => console.log(next), error: (e) => console.error(e)})
  );

  private readonly messagesSub$ = new Subject<string>();
  readonly messagesObs$: Observable<string[]> = this.messagesSub$.asObservable().pipe(
    scan((acc: string[], curr) => ([...acc, curr]), [])
  );

  message = '';

  constructor(private readonly websocketService: WebsocketService) {
    this.websocketService.connect();
  }

  sendMessage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log(this.message);
    this.messagesSub$.next(this.message);
    this.message = '';
    // this.websocketService.sendMessage(message);
  }
}
