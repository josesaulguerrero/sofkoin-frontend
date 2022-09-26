import { Component, OnInit } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { commandCommitTradeTransaction } from 'src/app/models/commands/commandCommitTradeTransaction';
import { CryptoPrice } from 'src/app/models/cryptoprice';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { ErrorModel } from 'src/app/models/errorModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
})
export class SellComponent implements OnInit {
  constructor(
    private requestBeta: BetarequestService,
    private requestAlpha: RequestService,
    private state: StateService
  ) {}
  newAmount: number = 0;
  cryptoBalanceSelected: string = '--';
  cryptoSelected?: string;
  cashAvailable?: number;
  userCryptos?: UserCryptosList[] = [];

  availableCryptos?: UserCryptosList[];
  cryptos?: CryptoPriceModel[];

  ngOnInit(): void {
    this.getCryptoPrices();
    this.getUserCryptos();
  }

  async getUserCryptos() {
    this.state.user.subscribe((data) => {
      data.cryptos.forEach((crypto) => this.userCryptos?.push(crypto));
      this.availableCryptos = data.cryptos;
      this.cashAvailable = data.currentCash;
    });
  }

  async getCryptoPrices() {
    interval(0.1 * 60 * 1000)
      .pipe(mergeMap(() => this.requestBeta.geAllCryptoPriceMethod()))
      .subscribe((data: CryptoPriceModel[]) => {
        this.cryptos = data;
      });
  }

  setCryptoBalance() {
    let selectElement = document.getElementById(
      'cryptoBalance'
    ) as HTMLSelectElement;
    let cryptoSelected =
      selectElement.options[selectElement.selectedIndex].value;
    let inputBalance = document.getElementById(
      'userCryptoBalance'
    ) as HTMLInputElement;

    this.cryptoBalanceSelected = String(
      this.userCryptos?.filter((crypto) => crypto.symbol === cryptoSelected)[0]
        .amount
    );

    inputBalance.value = this.cryptoBalanceSelected;

    console.log(this.cryptoSelected);
  }

  actionBuy() {
    let selectElement = document.getElementById(
      'availableCryptos'
    ) as HTMLSelectElement;
    let cryptoSelected =
      selectElement.options[selectElement.selectedIndex].value;
    let token: string = localStorage.getItem('token') as string;

    console.log(cryptoSelected);
    let command: commandCommitTradeTransaction = {
      buyerId: localStorage.getItem('userId') as string,
      transactionType: 'SELL',
      cryptoSymbol: cryptoSelected,
      cryptoPrice: String(
        this.cryptos?.filter((c) => c.symbol === cryptoSelected)[0].price
      ),
      cryptoAmount: String(this.newAmount),
      cash: this.cashAvailable as number,
    };
    if (this.validation()) {
      this.requestAlpha.tradeTransactionMethod(command, token).subscribe({
        next: (data) => {
          if (data) {
            alert('You successfully sell ' + cryptoSelected);
          }
        },
        error: (err: ErrorModel) => {
          alert(err.error.errorMessage);
        },
      });
    }

    //TODO: ACTUALIZAR EL ESTADO DEL USUARIO/MOSTRAR USD
    console.log(command);
  }

  validation(): boolean {
    if (
      !isFinite(this.newAmount) ||
      this.newAmount! < 0.000001 ||
      this.newAmount! > 100000 ||
      this.newAmount === undefined
    ) {
      alert('The amount must be a number between 0.000001 and 100000');
      return false;
    }
    alert('Ok');
    return true;
  }
}
