import { Component, OnInit } from '@angular/core';
import { ErrorModel } from 'src/app/models/errorModel';
import { OfferModel } from 'src/app/models/offerModel';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { UserModel } from 'src/app/models/UserModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import {
  confirmAlert,
  errorAlert,
  successAlert,
} from 'src/app/services/sweet-alert-funcs/alerts';

@Component({
  selector: 'app-activeoffers',
  templateUrl: './activeoffers.component.html',
  styleUrls: ['./activeoffers.component.css'],
})
export class ActiveoffersComponent implements OnInit {
  private CONFIRMATION_MSG_BUY = 'Are you sure you want to buy this offer?';
  private CONFIRMATION_MSG_DEL = 'Are you sure you want to delete this offer?';

  constructor(
    private state: StateService,
    private betarequest: BetarequestService,
    private alphaservice: RequestService,
    private socketService: SocketService
  ) {}

  user?: UserModel;
  offers: OfferModel[] = [];

  ngOnInit(): void {
    this.getMarket();
    this.deleteOfferListener();
    this.publishOfferListener();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.state.user.subscribe((currentUser) => (this.user = currentUser));
  }

  async deleteOfferListener() {
    this.socketService.P2POfferDeletedListener().subscribe({
      next: (offerToBeDeleted) => {
        this.offers = this.offers.filter(
          (offer) => offer.offerId !== offerToBeDeleted.offerId
        );
      },
    });
  }

  async publishOfferListener() {
    this.socketService
      .P2POfferPublished(localStorage.getItem('userId') as string)
      .subscribe({
        next: (offerPublished) => {
          this.offers.unshift(offerPublished);
        },
      });
  }

  getMarket() {
    this.betarequest.geAllMarketsMethod().subscribe({
      next: (markets) => {
        const market = markets[0];

        this.state.market.next(market);

        this.offers = market.offers.reverse();
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
  deleteoffer(offer: OfferModel) {
    confirmAlert({
      msg: this.CONFIRMATION_MSG_DEL,
      confMsg: 'Delete!',
    }).then((response) => {
      if (response.isConfirmed) {
        this.alphaservice
          .deleteOfferMethod(
            {
              marketId: this.state.market.value.marketId,
              offerId: offer.offerId,
            },
            localStorage.getItem('token')!
          )
          .subscribe({
            next: () => {
              successAlert('Offer succesfully deleted');
            },
            error: (err: ErrorModel) => {
              if (
                err.error.errorMessage === null ||
                err.error.errorMessage === undefined
              ) {
                errorAlert('Something went wrong with the market');
              } else {
                errorAlert(err.error.errorMessage);
              }
            },
          });
      }
    });
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
    confirmAlert({
      msg: this.CONFIRMATION_MSG_BUY,
      confMsg: 'Buy!',
    }).then((response) => {
      if (response.isConfirmed) {
        this.alphaservice
          .p2pTransactionMethod(
            {
              buyerId: localStorage.getItem('userId')!,
              marketId: this.state.market.value.marketId,
              offerId: offer.offerId,
            },
            localStorage.getItem('token')!
          )
          .subscribe({
            next: (response) => {
              const isBuying = response.some(
                (res) => res.transactionType === 'BUY'
              );

              if (isBuying && this.user) {
                const event = response[0];

                const crypto: UserCryptosList = {
                  symbol: event.cryptoSymbol,
                  amount: event.cryptoAmount,
                  priceUsd: event.cryptoPrice,
                };

                this.offers = this.offers.filter(function (e) {
                  return e.offerId !== offer.offerId;
                });

                this.state.buyCryptoEvent(event.cash, crypto, this.user);
                successAlert('You bought successfully this offer.');
              }
            },
            error: (err: ErrorModel) => {
              if (
                err.error.errorMessage === null ||
                err.error.errorMessage === undefined
              ) {
                errorAlert('Something went wrong with the market');
              } else {
                errorAlert(err.error.errorMessage);
              }
            },
          });
      }
    });
  }
}
