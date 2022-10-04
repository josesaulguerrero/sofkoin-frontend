import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';
import { UserCrypto } from 'src/app/models/UserCrypto';
import { ErrorModel } from 'src/app/models/errorModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { MarketModel } from 'src/app/models/marketmodel';
import { selectMarket } from 'src/app/services/state/ngrx/selectors/market-selectors';
import {
  errorAlert,
  successAlert,
} from 'src/app/services/sweet-alert-funcs/alerts';
@Component({
  selector: 'app-singleuser',
  templateUrl: './singleuser.component.html',
  styleUrls: ['./singleuser.component.css'],
})
export class SingleuserComponent implements OnInit {
  @Input() singleuser?: UserModel;
  usercoins?: UserCrypto[];
  message: string = '';
  newammount: string = '';
  newprice: string = '';
  currentcoin: string = '';
  total: string = '';

  marketSelector = this.store.select(selectMarket);
  market?: MarketModel;

  constructor(private request: RequestService, private store: Store) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    if (
      this.singleuser?.cryptos !== undefined &&
      this.singleuser?.cryptos.length >= 1
    ) {
      this.usercoins = this.singleuser.cryptos;
    }
  }

  public getCurrentMarket() {
    this.marketSelector.subscribe((market) => (this.market = market));
  }

  @HostListener('keyup')
  onkeypress() {
    if (this.newammount !== '' && this.newprice !== '') {
      let amount = Number(this.newammount);
      let price = Number(this.newprice);
      this.total = String(amount * price);
    }
  }
  makeOffer(cryptosymbol: string) {
    let offerForm = document.getElementById(
      'offerform' + this.singleuser!.userId
    );
    offerForm!.className = 'offerform';
    this.currentcoin = cryptosymbol;
  }
  existusercoins(): boolean {
    if (
      this.singleuser?.cryptos !== undefined &&
      this.singleuser?.cryptos.length >= 1
    ) {
      this.usercoins = this.singleuser.cryptos;
      return true;
    } else {
      this.message = 'the user has no coins';
      return false;
    }
  }
  buyOffer() {
    debugger;
    const total = Number(this.total);
    if (total < 5 || total > 100000) {
      errorAlert(
        'The offer needs a minimum value of 5USD and a maximum value of 100.000USD'
      );
      return;
    }
    if (this.validation() && this.market) {
      this.request
        .saveMessageMethod(
          {
            marketId: this.market.marketId,
            senderId: localStorage.getItem('userId')!,
            receiverId: this.singleuser?.userId,
            cryptoSymbol: this.currentcoin,
            cryptoAmount: this.newammount,
            cryptoPrice: this.newprice,
          },
          localStorage.getItem('token')!
        )
        .subscribe({
          next: (response) => {
            successAlert('Message Sended');
            this.message = '';
            this.newammount = '';
            this.newprice = '';
            this.total = '';
            console.log(response);
          },
          error: (err: ErrorModel) => {
            this.message = '';
            this.newammount = '';
            this.newprice = '';
            this.total = '';
            if (
              !(
                err.error.errorMessage === null ||
                err.error.errorMessage === undefined
              )
            ) {
              errorAlert(err.error.errorMessage);
            } else {
              errorAlert('Something went wrong');
            }
          },
        });
    }
  }

  validation(): boolean {
    //^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
    if (localStorage.getItem('userId') === this.singleuser?.userId) {
      alert('You can not buy your own offer');
      return false;
    }
    if (this.newammount === null || this.newammount === undefined) {
      alert('Amount undefined');
      return false;
    }
    if (this.newammount !== '' && this.newprice !== '') {
      let amount = Number(this.newammount);
      let price = Number(this.newprice);
      this.total = String(amount * price);
      if (amount * price < 5) {
        alert('Minimun transaction amount is $5 USD');
        return false;
      }
    }

    return true;
  }
}
