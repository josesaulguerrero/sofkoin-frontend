import { Component, OnInit } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { CryptoPrice } from 'src/app/models/cryptoprice';
import { CryptoPriceModel } from 'src/app/models/CryptoPriceModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
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
  cryptoBalanceSelected: string = '--';
  cryptoSelected?: string;
  userCryptos?: UserCryptosList[];
  cryptos?: CryptoPriceModel[];

  ngOnInit(): void {
    this.getCryptoPrices();
    this.getUserCryptos();
    //this.startBalance();
  }
  /*
  startBalance() {
    let inputBalance = document.getElementById(
      'userCryptoBalance'
    ) as HTMLInputElement;
    inputBalance.value = '--';
    this.setCryptoBalance();
  }*/

  async getUserCryptos() {
    this.state.user.subscribe((data) => {
      this.userCryptos = data.cryptos;
      this.setCryptoBalance();
    });
  }

  async getCryptoPrices() {
    interval(0.1 * 60 * 1000)
      .pipe(mergeMap(() => this.requestBeta.geAllCryptoPriceMethod()))
      .subscribe((data: CryptoPriceModel[]) => {
        this.cryptos = data;
      });
  }

  test() {
    console.log(this.cryptoSelected);
  }

  setCryptoBalance() {
    /*
    let selectElement = document.getElementById(
      'cryptoBalance'
    ) as HTMLSelectElement;
    let cryptoSelected =
      selectElement.options[selectElement.selectedIndex].value;
    let inputBalance = document.getElementById(
      'userCryptoBalance'
    ) as HTMLInputElement;*/

    this.cryptoBalanceSelected = this.userCryptos?.filter(
      (crypto) => crypto.symbol === this.cryptoSelected
    )[0].amount as string;

    console.log(this.cryptoSelected);
  }
}
