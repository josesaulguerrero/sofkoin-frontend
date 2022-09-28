import { Component, OnInit } from '@angular/core';
import { delay, interval, mergeMap, repeat, tap } from 'rxjs';
import { commandCommitTradeTransaction } from 'src/app/models/commands/commandCommitTradeTransaction';
import { CryptoPrice } from 'src/app/models/cryptoprice';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { ErrorModel } from 'src/app/models/errorModel';
import { UserModel } from 'src/app/models/UserModel';
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
  newAmount?: number;
  cryptoBalanceSelected?: number;
  cryptoSelected: string = '--';
  cryptoSelectedTotalPrice: number = 0;
  cashAvailable?: number;
  isLoaded: boolean = true;
  user?: UserModel;
  cryptos?: CryptoPriceModel[];

  ngOnInit(): void {
    this.getFirstCryptoPrices();
    this.getCryptoPrices();
    this.getCurrentUser();
  }

  async getCryptoPrices() {
    interval(6000)
      .pipe(mergeMap(() => this.requestBeta.geAllCryptoPriceMethod()))
      .subscribe((data: CryptoPriceModel[]) => {
        this.cryptos = data;
        this.isLoaded = true;
        this.getCryptoSelectedTotalPrice();
      });
  }

  getCurrentUser() {
    this.state.user.subscribe((currentUser) => (this.user = currentUser));
  }

  getAmountAndBalance() {
    this.getCryptoSelectedTotalPrice();
    this.setCryptoBalance();
  }

  private getCryptoSelectedPrice(): number | undefined {
    const crypto = this.cryptos?.find(
      (crypto) => crypto.symbol === this.cryptoSelected
    );

    return crypto?.price;
  }

  private getCryptoSelectedTotalPrice() {
    if (this.cryptoSelected !== '--') {
      const cryptoPrice = this.getCryptoSelectedPrice();

      if (this.newAmount && cryptoPrice) {
        const newTotalPrice = (cryptoPrice * this.newAmount).toFixed(2);
        this.cryptoSelectedTotalPrice = Number(newTotalPrice);
      } else this.cryptoSelectedTotalPrice = 0;
    }
  }

  async getFirstCryptoPrices() {
    this.requestBeta.geAllCryptoPriceMethod().subscribe((cryptos) => {
      this.cryptos = cryptos;
    });
  }

  private setCryptoBalance() {
    const cryptoUser = this.user?.cryptos?.find(
      (crypto) => crypto.symbol === this.cryptoSelected
    );

    this.cryptoBalanceSelected = cryptoUser && cryptoUser.amount;
  }

  actionBuy() {
    const userId: string = localStorage.getItem('userId') as string;
    const token: string = localStorage.getItem('token') as string;

    let command: commandCommitTradeTransaction = {
      buyerId: userId,
      transactionType: 'SELL',
      cryptoSymbol: this.cryptoSelected,
      cryptoPrice: String(this.getCryptoSelectedPrice()),
      cryptoAmount: String(this.newAmount),
    };
    if (this.validation()) {
      this.requestAlpha.tradeTransactionMethod(command, token).subscribe({
        next: (data) => {
          if (this.user) {
            const sellEvent = data[0];
            const crypto: UserCryptosList = {
              symbol: sellEvent.cryptoSymbol,
              amount: sellEvent.cryptoAmount,
              priceUsd: sellEvent.cryptoPrice,
            };

            this.state.sellCryptoEvent(sellEvent.cash, crypto, this.user);
            alert('You successfully sell ' + this.cryptoSelected);
          }

          this.cleanInputs();
        },
        error: (err: ErrorModel) => {
          alert(err.error.errorMessage);
          this.cleanInputs();
        },
      });
    }

    //TODO: ACTUALIZAR EL ESTADO DEL USUARIO/MOSTRAR USD
  }

  private cleanInputs() {
    this.newAmount = undefined;
    this.getAmountAndBalance();
  }

  private validation(): boolean {
    if (
      (this.newAmount && !isFinite(this.newAmount)) ||
      this.newAmount! < 0.000001 ||
      this.newAmount! > 100000 ||
      this.newAmount === undefined
    ) {
      alert('The amount must be a number between 0.000001 and 100000');
      return false;
    }
    return true;
  }
}
