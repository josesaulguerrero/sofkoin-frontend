import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, mergeMap } from 'rxjs';
import { commandCommitTradeTransaction } from 'src/app/models/commands/commandCommitTradeTransaction';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserCrypto } from 'src/app/models/UserCrypto';
import { ErrorModel } from 'src/app/models/errorModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { buyCryptoAction } from 'src/app/services/state/ngrx/actions/user/buyCryptoAction';
import { selectUserCash } from 'src/app/services/state/ngrx/selectors/user-selectors';
import { StateService } from 'src/app/services/state/state.service';
import {
  errorAlert,
  successAlert,
} from 'src/app/services/sweet-alert-funcs/alerts';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
})
export class BuyComponent implements OnInit {
  newCryptolist: string[] = [
    'BTC',
    'ETH',
    'BNB',
    'ADA',
    'SOL',
    'XRP',
    'DOT',
    'TRX',
    'AVAX',
    'ETC',
  ];

  newCryptoBuy?: number;
  cryptoSelected: string = '--';
  cryptos?: CryptoPriceModel[];
  USDCryptoValue?: number;
  currencyConverterFactor: number = 0;

  userCashSelector = this.store.select(selectUserCash);
  currentCash: number = 0;

  constructor(
    private requestBeta: BetarequestService,
    private requestAlpha: RequestService,
    private store: Store
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getCryptoPricesFirstTime();
    this.getCryptoPrices();
    this.getCurrentUserCash();
    this.startPrice();
  }

  startPrice() {
    this.currencyConverterFactor = this.cryptos?.filter(
      (coin) => coin.symbol === 'BTC'
    )[0].price as number;
  }

  getCryptoPricesFirstTime() {
    this.requestBeta.geAllCryptoPriceMethod().subscribe((data) => {
      this.cryptos = data;
    });
  }

  getCryptoPrices() {
    interval(6000)
      .pipe(mergeMap(() => this.requestBeta.geAllCryptoPriceMethod()))
      .subscribe((data: CryptoPriceModel[]) => (this.cryptos = data));
  }

  getCurrentUserCash() {
    this.userCashSelector.subscribe(
      (currentUserCash) => (this.currentCash = currentUserCash)
    );
  }

  changeConversionFactor() {
    if (this.cryptos) {
      this.currencyConverterFactor =
        this.cryptos?.find((coin) => coin.symbol === this.cryptoSelected)
          ?.price ?? 0;
    }
  }

  private getCryptoSelectedPrice(): number | undefined {
    const crypto = this.cryptos?.find(
      (crypto) => crypto.symbol === this.cryptoSelected
    );

    return crypto?.price;
  }

  private cleanInputs() {
    this.USDCryptoValue = undefined;
    this.getCryptoSelectedPrice();
  }

  actionBuy() {
    const userId: string = localStorage.getItem('userId') as string;
    const token: string = localStorage.getItem('token') as string;

    let input = document.getElementById('newAmount') as HTMLInputElement;

    let command: commandCommitTradeTransaction = {
      buyerId: userId,
      transactionType: 'BUY',
      cryptoSymbol: this.cryptoSelected,
      cryptoPrice: String(this.getCryptoSelectedPrice()),
      cryptoAmount: String(input.value),
    };

    this.requestAlpha.tradeTransactionMethod(command, token).subscribe({
      next: (data) => {
        if (this.currentCash) {
          const buyEvent = data[0];
          const crypto: UserCrypto = {
            symbol: buyEvent.cryptoSymbol,
            amount: buyEvent.cryptoAmount,
            priceUsd: buyEvent.cryptoPrice,
          };

          this.store.dispatch(buyCryptoAction({ cash: buyEvent.cash, crypto }));
          successAlert('You successfully bought ' + this.cryptoSelected);
        }

        this.cleanInputs();
      },
      error: (err: ErrorModel) => {
        errorAlert(err.error.errorMessage);
        this.cleanInputs();
      },
    });
  }
}
