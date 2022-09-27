import { commandPublishP2POffer } from './../../../models/commands/commandPublishP2POffer';
import { UserCryptosList } from './../../../models/CryptoUsrList';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserModel } from 'src/app/models/UserModel';
import { StateService } from 'src/app/services/state/state.service';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { MarketModel } from 'src/app/models/marketmodel';

@Component({
  selector: 'app-publishoffer',
  templateUrl: './publishoffer.component.html',
  styleUrls: ['./publishoffer.component.css'],
})
export class PublishofferComponent implements OnInit {
  user!: UserModel;
  userCryptos?: string[];
  offerCryptoPrice!: number;
  offerCryptoAmount!: number;
  offerUsdCash: number = 0;
  selectedCrypto?: UserCryptosList | null;
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
    this.offerUsdCash = this.offerCryptoAmount * this.offerCryptoPrice;
  }

  public publishOffer() {
    if (this.offerCryptoAmount > this.selectedCrypto!.amount) {
      alert('You do not have enough crypto to publish this offer.');
    } else if (this.offerUsdCash < 5 || this.offerUsdCash > 100000) {
      alert(
        'The offer needs a minimum value of 5USD and a maximum value of 100.000USD'
      );
    } else {
      const newOffer: commandPublishP2POffer = {
        marketId: this.market!.marketId,
        publisherId: this.user!.userId,
        targetAudienceId: '-',
        cryptoSymbol: this.selectedCrypto!.symbol,
        offerCryptoAmount: this.offerCryptoAmount,
        offerCryptoPrice: this.offerCryptoPrice,
      };
      this.alphaRequest.publishOfferMethod(
        newOffer,
        localStorage.getItem('token') as string
      );
    }
  }
}
