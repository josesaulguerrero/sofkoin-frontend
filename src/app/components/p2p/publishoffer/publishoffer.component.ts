import { commandPublishP2POffer } from './../../../models/commands/commandPublishP2POffer';
import { UserCrypto } from '../../../models/UserCrypto';
import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { MarketModel } from 'src/app/models/marketmodel';
import { ErrorModel } from 'src/app/models/errorModel';
import { Store } from '@ngrx/store';
import { selectUserCryptos } from 'src/app/services/state/ngrx/selectors/user-selectors';
import { selectMarket } from 'src/app/services/state/ngrx/selectors/market-selectors';
import { publishOfferAction } from 'src/app/services/state/ngrx/actions/market/publishOfferAction';
import { OfferModel } from 'src/app/models/offerModel';
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
  offerCryptoPrice?: number;
  offerCryptoAmount?: number;
  offerUsdCash: number = 0;
  selectedCrypto?: UserCrypto;

  userCryptosSelector = this.store.select(selectUserCryptos);
  marketSelector = this.store.select(selectMarket);
  market?: MarketModel;
  userCryptos: UserCrypto[] = [];

  constructor(private store: Store, private alphaRequest: RequestService) {}

  ngOnInit(): void {
    this.getUserCryptos();
    this.getCurrentMarket();
  }

  getUserCryptos() {
    this.userCryptosSelector.subscribe(
      (cryptos) => (this.userCryptos = cryptos)
    );
  }

  public getCurrentMarket() {
    this.marketSelector.subscribe((market) => (this.market = market));
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
      const userId: string = localStorage.getItem('userId') as string;
      const newOffer: commandPublishP2POffer = {
        marketId: this.market!.marketId,
        publisherId: userId,
        targetAudienceId: '-',
        cryptoSymbol: this.selectedCrypto!.symbol,
        offerCryptoAmount: this.offerCryptoAmount!,
        offerCryptoPrice: this.offerCryptoPrice!,
      };
      this.alphaRequest
        .publishOfferMethod(newOffer, localStorage.getItem('token') as string)
        .subscribe({
          next: (response) => {
            const publishEvent = response[0];
            const offer: OfferModel = {
              offerId: publishEvent.offerId,
              publisherId: publishEvent.publisherId,
              targetAudienceId: publishEvent.targetAudienceId,
              cryptoSymbol: publishEvent.cryptoSymbol,
              cryptoAmount: publishEvent.cryptoAmount,
              cryptoPrice: publishEvent.cryptoPrice,
            };

            this.store.dispatch(publishOfferAction({ offer }));
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
