import { Component, OnInit } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { commandCommitTradeTransaction } from 'src/app/models/commands/commandCommitTradeTransaction';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserCrypto } from 'src/app/models/UserCrypto';
import { ErrorModel } from 'src/app/models/errorModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { Store } from '@ngrx/store';
import { selectUserCryptos } from 'src/app/services/state/ngrx/selectors/user-selectors';
import { sellCryptoAction } from 'src/app/services/state/ngrx/actions/user/sellCryptoAction';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
})
export class SellComponent implements OnInit {
  newAmount?: number;
  cryptoBalanceSelected?: number;
  cryptoSelected: string = '--';
  cryptoSelectedTotalPrice: number = 0;
  cashAvailable?: number;
  isLoaded: boolean = true;
  cryptos?: CryptoPriceModel[];

  userCryptosSelector = this.store.select(selectUserCryptos);
  userCryptos: UserCrypto[] = [];

  constructor(
    private requestBeta: BetarequestService,
    private requestAlpha: RequestService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getFirstCryptoPrices();
    this.getCryptoPrices();
    this.getUserCryptos();
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

  getUserCryptos() {
    this.userCryptosSelector.subscribe({
      next: (cryptos) => {
        this.userCryptos = cryptos;
        this.getAmountAndBalance();
      },
    });
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
    const cryptoUser = this.userCryptos?.find(
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
          if (this.userCryptos.length) {
            const sellEvent = data[0];
            const crypto: UserCrypto = {
              symbol: sellEvent.cryptoSymbol,
              amount: sellEvent.cryptoAmount,
              priceUsd: sellEvent.cryptoPrice,
            };

            this.store.dispatch(
              sellCryptoAction({ cash: sellEvent.cash, crypto })
            );
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
