import { Component, OnInit } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { commandCommitTradeTransaction } from 'src/app/models/commands/commandCommitTradeTransaction';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { ErrorModel } from 'src/app/models/errorModel';
import { UserModel } from 'src/app/models/UserModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
})
export class BuyComponent implements OnInit {
  constructor(
    private requestBeta: BetarequestService,
    private requestAlpha: RequestService,
    private state: StateService
  ) {}

  isLoaded: boolean = true;
  user?: UserModel;
  newCryptoBuy?: number;
  cryptoSelected: string = '--';
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

  cryptos?: CryptoPriceModel[];

  USDCryptoValue?: number;
  currencyConverterFactor: number = 0;

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
      .subscribe((data: CryptoPriceModel[]) => {
        this.cryptos = data;
        this.isLoaded = true;
      });
  }

  getCurrentUser() {
    this.state.user.subscribe((currentUser) => (this.user = currentUser));
  }

  changeConversionFactor() {
    if (this.cryptos) {
      this.currencyConverterFactor =
        this.cryptos?.find((coin) => coin.symbol === this.cryptoSelected)
          ?.price ?? 0;
    }
  }

  //Settea el precio de btc por defecto y luego hacer una funcion que en on change cambie el valor por el que se opera

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    //If cashUser = '' then make a get request to get user cash
    this.getCryptoPricesFirstTime();
    this.getCryptoPrices();
    this.getCurrentUser();
    this.startPrice();
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
        if (this.user) {
          const buyEvent = data[0];
          const crypto: UserCryptosList = {
            symbol: buyEvent.cryptoSymbol,
            amount: buyEvent.cryptoAmount,
            priceUsd: buyEvent.cryptoPrice,
          };
          this.state.buyCryptoEvent(buyEvent.cash, crypto, this.user);
          alert('You successfully bought ' + this.cryptoSelected);
        }

        this.cleanInputs();
      },
      error: (err: ErrorModel) => {
        alert(err.error.errorMessage);
        this.cleanInputs();
      },
    });

    // Update user state
    // Toca hacer un get de la info del user o hacer la resta pero es más peligroso por decimales
  }
}
