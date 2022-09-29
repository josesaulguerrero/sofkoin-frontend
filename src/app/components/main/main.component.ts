import { Component, OnInit } from '@angular/core';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { UserModel } from 'src/app/models/UserModel';
import { SocketService } from 'src/app/services/socket/socket.service';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  user?: UserModel;
  constructor(private socket: SocketService, private state: StateService) {}
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getCurrentUser();
    this.connectToP2PTranctionWebSocket();
  }

  connectToP2PTranctionWebSocket() {
    this.socket.P2PTransactionCommitted().subscribe({
      next: (respose) => {
        if (!this.user) return;

        if (respose.userId === this.user.userId && respose.type === 'SELL') {
          const crypto: UserCryptosList = {
            amount: respose.cryptoAmount,
            priceUsd: respose.cryptoPrice,
            symbol: respose.cryptoSymbol,
          };

          const cash: number = crypto.amount * crypto.priceUsd;

          this.state.sellCryptoEvent(cash, crypto, this.user);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getCurrentUser() {
    this.state.user.subscribe((currentUser) => (this.user = currentUser));
  }
}
