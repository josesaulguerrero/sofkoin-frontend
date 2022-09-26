import { Component, OnInit } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { commandCommitTradeTransaction } from 'src/app/models/commands/commandCommitTradeTransaction';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { ErrorModel } from 'src/app/models/errorModel';
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
  cashAvailable: string = '';
  newCryptoBuy: string = '';
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

  async getCryptoPrices() {
    interval(0.1 * 60 * 1000)
      .pipe(mergeMap(() => this.requestBeta.geAllCryptoPriceMethod()))
      .subscribe((data: CryptoPriceModel[]) => {
        this.cryptos = data;
      });
  }

  getCashAvailable() {
    this.state.user.subscribe((data) => {
      this.cashAvailable = data.currentCash;
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    //If cashUser = '' then make a get request to get user cash
    this.getCryptoPrices();
    this.getCashAvailable();
  }
  actionBuy() {
    let token = localStorage.getItem('token') as string;
    let userId = localStorage.getItem('userId');
    let selectElement = document.getElementById(
      'cryptobuyselect'
    ) as HTMLSelectElement;
    let cryptoSelected =
      selectElement.options[selectElement.selectedIndex].value;
    let command: commandCommitTradeTransaction = {
      buyerId: localStorage.getItem('userId') as string,
      transactionType: 'BUY',
      cryptoSymbol: cryptoSelected,
      cryptoPrice: String(
        this.cryptos?.filter((c) => c.symbol === cryptoSelected)[0].price
      ),
      cryptoAmount: this.newCryptoBuy,
      cash: this.cashAvailable,
    };

    this.requestAlpha.tradeTransactionMethod(command, token).subscribe({
      next: (data) => {
        if (data) {
          alert('You successfully bought ' + cryptoSelected);
        }
      },
      error: (err: ErrorModel) => {
        alert(err.error.errorMessage);
      },
    });

    this.newCryptoBuy = '';
    //Update user state
    //Toca hacer un get de la info del user o hacer la resta pero es más peligroso por decimales
    console.log(command);
  }
}
