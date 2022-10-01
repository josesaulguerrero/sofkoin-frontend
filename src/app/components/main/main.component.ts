import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ErrorModel } from 'src/app/models/errorModel';
import { UserCrypto } from 'src/app/models/UserCrypto';
import { UserModel } from 'src/app/models/UserModel';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { logInAction } from 'src/app/services/state/ngrx/actions/user/logInAction';
import { sellCryptoAction } from 'src/app/services/state/ngrx/actions/user/sellCryptoAction';
import { selectUser } from 'src/app/services/state/ngrx/selectors/user-selectors';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  userSelector = this.store.select(selectUser);
  user?: UserModel;
  userIsLoaded = false;

  constructor(
    private socket: SocketService,
    private store: Store,
    private betarequest: BetarequestService
  ) {}
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.connectToP2PTranctionWebSocket();
    this.asyncgetUserData();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userSelector.subscribe((currentUser) => (this.user = currentUser));
  }

  connectToP2PTranctionWebSocket() {
    this.socket.P2PTransactionCommitted().subscribe({
      next: (respose) => {
        if (!this.user) return;

        if (respose.userId === this.user.userId && respose.type === 'SELL') {
          const crypto: UserCrypto = {
            amount: respose.cryptoAmount,
            priceUsd: respose.cryptoPrice,
            symbol: respose.cryptoSymbol,
          };

          const cash: number = crypto.amount * crypto.priceUsd;

          this.store.dispatch(sellCryptoAction({ cash, crypto }));
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async asyncgetUserData() {
    let userId = localStorage.getItem('userId')!;
    this.betarequest.getUserByIdMethod(userId).subscribe({
      next: (user) => {
        if (user) {
          this.store.dispatch(
            logInAction({
              userId,
              fullName: user.fullName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              authMethod: '',
              avatarUrl: user.avatarUrl,
              currentCash: user.currentCash,
              messages: user.messages,
              cryptos: user.cryptos,
              activities: user.activities,
              transactions: user.transactions,
            })
          );

          this.userIsLoaded = true;
        }
      },
      error: (err: ErrorModel) => {
        alert('The user is not registered: ' + err.error.errorMessage);
      },
    });
  }
}
