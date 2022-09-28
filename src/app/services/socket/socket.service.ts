import { TransactionsList } from 'src/app/models/transactionList';
import { MessagesList } from './../../models/MessagesList';
import { OfferModel } from './../../models/offerModel';
import { map, merge } from 'rxjs';
import { StompService } from './../stomp/stomp.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private stompService: StompService) {
    this.stompService.activate();
  }

  public P2POfferPublished(userId: string) {
    return merge(
      this.stompService.watch('/topic/p2p.offer.published'),
      this.stompService.watch(`/topic/${userId}/p2p.offer.published`)
    ).pipe(
      map((wsMessage) => {
        return JSON.parse(wsMessage.body) as OfferModel;
      })
    );
  }

  public P2POfferDeletedListener() {
    return this.stompService.watch('/topic/p2p.offer.deleted').pipe(
      map((wsMessage) => {
        return JSON.parse(wsMessage.body) as OfferModel;
      })
    );
  }

  public offerMessageSavedListener(userId: string) {
    return this.stompService.watch(`/topic/${userId}/message.saved`).pipe(
      map((wsMessage) => {
        return JSON.parse(wsMessage.body) as MessagesList;
      })
    );
  }

  public offerMessageStatusChangedListener(userId: string) {
    return this.stompService
      .watch(`/topic/${userId}/message.status.changed`)
      .pipe(
        map((wsMessage) => {
          return JSON.parse(wsMessage.body) as MessagesList;
        })
      );
  }

  public P2PTransactionCommitted() {
    return this.stompService.watch('/topic/p2p.transaction.committed').pipe(
      map((wsMessage) => {
        return JSON.parse(wsMessage.body) as TransactionsList;
      })
    );
  }
}
