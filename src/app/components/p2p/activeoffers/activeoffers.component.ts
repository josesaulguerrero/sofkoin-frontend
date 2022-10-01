import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorModel } from 'src/app/models/errorModel';
import { OfferModel } from 'src/app/models/offerModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { UserCrypto } from 'src/app/models/UserCrypto';
import { Store } from '@ngrx/store';
import { buyCryptoAction } from 'src/app/services/state/ngrx/actions/user/buyCryptoAction';
import { selectMarket } from 'src/app/services/state/ngrx/selectors/market-selectors';
import { MarketModel } from 'src/app/models/marketmodel';
import { publishOfferAction } from 'src/app/services/state/ngrx/actions/market/publishOfferAction';
import { deleteOfferAction } from 'src/app/services/state/ngrx/actions/market/deleteOfferAction';
import { Observable, Subscription } from 'rxjs';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { getMarketAction } from 'src/app/services/state/ngrx/actions/market/getMarketAction';

@Component({
  selector: 'app-activeoffers',
  templateUrl: './activeoffers.component.html',
  styleUrls: ['./activeoffers.component.css'],
})
export class ActiveoffersComponent implements OnInit, OnDestroy {
  private CONFIRMATION_MSG_BUY = 'Are you sure you want to buy this offer?';
  private CONFIRMATION_MSG_DEL = 'Are you sure you want to delete this offer?';

  constructor(
    private store: Store,
    private alphaservice: RequestService,
    private socketService: SocketService,
    private betarequest: BetarequestService
  ) {}

  marketSelector = this.store.select(selectMarket);
  market?: MarketModel;
  deleteOfferSocket?: Subscription;
  publishOfferSocket?: Subscription;

  ngOnInit(): void {
    this.getMarket();
    this.getCurrentMarket();
    this.deleteOfferListener();
    this.publishOfferListener();
  }

  ngOnDestroy(): void {
    this.deleteOfferSocket?.unsubscribe();
    this.publishOfferSocket?.unsubscribe();
  }

  public getCurrentMarket() {
    this.marketSelector.subscribe((market) => (this.market = market));
  }

  getMarket() {
    this.betarequest.geAllMarketsMethod().subscribe({
      next: (markets) => {
        const market = markets[0];

        this.store.dispatch(
          getMarketAction({
            marketId: market.marketId,
            offers: market.offers.reverse(),
            cryptoSymbols: market.cryptoSymbols,
          })
        );
      },
      error: (err: ErrorModel) => {
        if (
          err.error.errorMessage === null ||
          err.error.errorMessage === undefined
        ) {
          alert('Something went wrong with the market');
        } else {
          alert(err.error.errorMessage);
        }
      },
    });
  }

  async deleteOfferListener() {
    this.deleteOfferSocket = this.socketService
      .P2POfferDeletedListener()
      .subscribe({
        next: (offerToBeDeleted) => {
          if (this.market) {
            this.store.dispatch(deleteOfferAction({ offer: offerToBeDeleted }));
          }
        },
      });
  }

  async publishOfferListener() {
    this.publishOfferSocket = this.socketService
      .P2POfferPublished(localStorage.getItem('userId') as string)
      .subscribe({
        next: (offerPublished) => {
          this.store.dispatch(publishOfferAction({ offer: offerPublished }));
        },
      });
  }

  deleteoffer(offer: OfferModel) {
    if (confirm(this.CONFIRMATION_MSG_DEL) && this.market) {
      this.alphaservice
        .deleteOfferMethod(
          {
            marketId: this.market.marketId,
            offerId: offer.offerId,
          },
          localStorage.getItem('token')!
        )
        .subscribe({
          next: () => {
            alert('Offer succesfully deleted');
          },
          error: (err: ErrorModel) => {
            if (
              err.error.errorMessage === null ||
              err.error.errorMessage === undefined
            ) {
              alert('Something went wrong with the market');
            } else {
              alert(err.error.errorMessage);
            }
          },
        });
    }
  }

  showOffer(offer: OfferModel): Boolean {
    let currentUserId = localStorage.getItem('userId')!;

    if (
      currentUserId === offer.targetAudienceId ||
      currentUserId === offer.publisherId ||
      offer.targetAudienceId === '-'
    ) {
      return true;
    }
    return false;
  }

  changeOfferclass(offer: OfferModel): Boolean {
    let currentUserId = localStorage.getItem('userId')!;
    let currentoffer = document.getElementById(offer.offerId);
    if (currentUserId === offer.targetAudienceId) {
      console.log(currentoffer);
      currentoffer!.className = 'offerforme';
      console.log(currentoffer);
      return true;
    }
    if (currentUserId === offer.publisherId) {
      console.log(currentoffer);
      currentoffer!.className = 'mineoffer';
      console.log(currentoffer);
      return true;
    }
    if (offer.targetAudienceId === '-') {
      return true;
    }
    return false;
  }

  showasmine(publisherId: string): Boolean {
    let currentUserId = localStorage.getItem('userId')!;
    if (currentUserId === publisherId) {
      return true;
    }
    return false;
  }

  showasgeneral(offer: OfferModel): Boolean {
    let currentUserId = localStorage.getItem('userId')!;
    if (offer.targetAudienceId === '-' && offer.publisherId !== currentUserId) {
      return true;
    }
    return false;
  }

  showasforme(publisherId: string): Boolean {
    let currentUserId = localStorage.getItem('userId')!;
    if (currentUserId === publisherId) {
      return true;
    }
    return false;
  }

  buyoffer(offer: OfferModel) {
    if (confirm(this.CONFIRMATION_MSG_BUY) && this.market) {
      this.alphaservice
        .p2pTransactionMethod(
          {
            buyerId: localStorage.getItem('userId')!,
            marketId: this.market.marketId,
            offerId: offer.offerId,
          },
          localStorage.getItem('token')!
        )
        .subscribe({
          next: (response) => {
            const isBuying = response.some(
              (res) => res.transactionType === 'BUY'
            );

            if (isBuying && this.market) {
              const event = response[0];

              const crypto: UserCrypto = {
                symbol: event.cryptoSymbol,
                amount: event.cryptoAmount,
                priceUsd: event.cryptoPrice,
              };

              this.store.dispatch(
                buyCryptoAction({ cash: event.cash, crypto })
              );
              alert('You bought successfully this offer.');
            }
          },
          error: (err: ErrorModel) => {
            if (
              err.error.errorMessage === null ||
              err.error.errorMessage === undefined
            ) {
              alert('Something went wrong with the market');
            } else {
              alert(err.error.errorMessage);
            }
          },
        });
    }
  }
}
