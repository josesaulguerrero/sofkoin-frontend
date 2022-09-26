import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { ErrorModel } from 'src/app/models/errorModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { StateService } from 'src/app/services/state/state.service';
@Component({
  selector: 'app-singleuser',
  templateUrl: './singleuser.component.html',
  styleUrls: ['./singleuser.component.css'],
})
export class SingleuserComponent implements OnInit {
  constructor(private request: RequestService, private state: StateService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    if (
      this.singleuser?.cryptos !== undefined &&
      this.singleuser?.cryptos.length >= 1
    ) {
      this.usercoins = this.singleuser.cryptos;
    }
  }
  @Input() singleuser?: UserModel;
  usercoins?: UserCryptosList[];
  message: string = '';
  newammount: string = '';
  newprice: string = '';
  currentcoin: string = '';
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
    if (this.validation()) {
      this.request
        .saveMessageMethod(
          {
            marketId: 'f2d4a64a-acbb-4918-9ed0-cb40f0c9eb2a',
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
            alert('Message Sended');
            console.log(response);
          },
          error: (err: ErrorModel) => {
            if (
              err.error.errorMessage === null ||
              err.error.errorMessage === undefined
            ) {
              alert('Something went wrong');
            } else {
              alert(err.error.errorMessage);
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
      alert('The email field is invalid');
      return false;
    }

    return true;
  }
}
