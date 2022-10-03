import { commandPublishP2POffer } from './../../../models/commands/commandPublishP2POffer';
import { UserCryptosList } from './../../../models/CryptoUsrList';
import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';
import { StateService } from 'src/app/services/state/state.service';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { MarketModel } from 'src/app/models/marketmodel';
import { ErrorModel } from 'src/app/models/errorModel';
import {
  errorAlert,
  successAlert,
} from 'src/app/services/sweet-alert-funcs/alerts';

@Component({
  selector: 'app-publishoffer',
  templateUrl: './publishoffer.component.html',
  styleUrls: ['./publishoffer.component.css'],
})
export class PublishofferComponent implements OnInit {
  user!: UserModel;
  offerCryptoPrice?: number;
  offerCryptoAmount?: number;
  offerUsdCash: number = 0;
  selectedCrypto?: UserCryptosList;
  market?: MarketModel;

  constructor(
    private state: StateService,
    private alphaRequest: RequestService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCurrentMarket();
  }

  public getCurrentUser() {
    this.state.user.subscribe((currentUser) => (this.user = currentUser));
  }

  public getCurrentMarket() {
    this.state.market.subscribe((market) => (this.market = market));
  }

  calculateOfferCash() {
    this.offerUsdCash = this.offerCryptoAmount! * this.offerCryptoPrice!;
  }

  public publishOffer() {
    if (this.offerCryptoAmount! > this.selectedCrypto!.amount) {
      errorAlert('You do not have enough crypto to publish this offer.');
    } else if (this.offerUsdCash < 5 || this.offerUsdCash > 100000) {
      errorAlert(
        'The offer needs a minimum value of 5USD and a maximum value of 100.000USD'
      );
    } else {
      const newOffer: commandPublishP2POffer = {
        marketId: this.market!.marketId,
        publisherId: this.user!.userId,
        targetAudienceId: '-',
        cryptoSymbol: this.selectedCrypto!.symbol,
        offerCryptoAmount: this.offerCryptoAmount!,
        offerCryptoPrice: this.offerCryptoPrice!,
      };
      this.alphaRequest
        .publishOfferMethod(newOffer, localStorage.getItem('token') as string)
        .subscribe({
          next: () => {
            successAlert('The offer was successfully publish.');
            this.cleanInputs();
          },
          error: (err: ErrorModel) => {
            errorAlert(err.error.errorMessage);
            this.cleanInputs();
          },
        });
    }
  }

  cleanInputs() {
    this.offerCryptoAmount = NaN;
    this.offerCryptoPrice = NaN;
    this.offerUsdCash = NaN;
    const select = document.getElementById('userCryptos') as HTMLSelectElement;
    select.selectedIndex = 0;
  }
}
