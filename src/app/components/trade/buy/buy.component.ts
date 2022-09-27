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

  isLoaded: boolean = false;
  user?: UserModel;
  newCryptoBuy?: number;
  selectedCrypto: string = '--';
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

  async getCryptoPricesFirstTime() {
    this.requestBeta.geAllCryptoPriceMethod().subscribe((data) => {
      this.cryptos = data;
    });
  }

  async getCryptoPrices() {
    interval(0.1 * 60 * 1000)
      .pipe(mergeMap(() => this.requestBeta.geAllCryptoPriceMethod()))
      .subscribe((data: CryptoPriceModel[]) => {
        this.cryptos = data;
        this.isLoaded = true;
      });
  }

  getCurrentUser() {
    this.state.user.subscribe((currentUser) => (this.user = currentUser));
  }

  async changeConversionFactor() {
    this.currencyConverterFactor = this.cryptos?.filter(
      (coin) => coin.symbol === this.selectedCrypto
    )[0].price as number;
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

  actionBuy() {
    let token = localStorage.getItem('token') as string;
    let userId = localStorage.getItem('userId');
    let selectElement = document.getElementById(
      'cryptobuyselect'
    ) as HTMLSelectElement;
    let cryptoSelected =
      selectElement.options[selectElement.selectedIndex].value;

    let input = document.getElementById('newAmount') as HTMLInputElement;

    let command: commandCommitTradeTransaction = {
      buyerId: localStorage.getItem('userId') as string,
      transactionType: 'BUY',
      cryptoSymbol: cryptoSelected,
      cryptoPrice: String(
        this.cryptos?.filter((c) => c.symbol === cryptoSelected)[0].price
      ),
      cryptoAmount: String(input.value),
    };

    this.requestAlpha.tradeTransactionMethod(command, token).subscribe({
      next: (data) => {
        if (this.user) {
          this.state.subtractCash(data[0].cash, this.user);
          alert('You successfully bought ' + cryptoSelected);
        }
      },
      error: (err: ErrorModel) => {
        alert(err.error.errorMessage);
      },
    });

    // Update user state
    // Toca hacer un get de la info del user o hacer la resta pero es más peligroso por decimales
  }
}
