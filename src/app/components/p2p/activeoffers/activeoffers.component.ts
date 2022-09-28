import { Component, OnInit } from '@angular/core';
import { ErrorModel } from 'src/app/models/errorModel';
import { OfferModel } from 'src/app/models/offerModel';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { SocketService } from 'src/app/services/socket/socket.service';
@Component({
  selector: 'app-activeoffers',
  templateUrl: './activeoffers.component.html',
  styleUrls: ['./activeoffers.component.css'],
})
export class ActiveoffersComponent implements OnInit {
  private CONFIRMATION_MSG = 'Are you sure you want to buy this offer?';
  constructor(
    private state: StateService,
    private betarequest: BetarequestService,
    private alphaservice: RequestService,
    private socketService: SocketService
  ) {}

  offers: OfferModel[] = [];

  ngOnInit(): void {
    this.getMarket();
    this.deleteOfferListener();
    this.publishOfferListener();
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
    this.alphaservice
      .deleteOfferMethod(
        {
          marketId: this.state.market.value.marketId,
          offerId: offer.offerId,
        },
        localStorage.getItem('token')!
      )
      .subscribe({
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
    if (confirm(this.CONFIRMATION_MSG)) {
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
            console.log(response);
            this.offers = this.offers.filter(function (e) {
              return e.offerId !== offer.offerId;
            });
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
