import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
import { MarketModel } from 'src/app/models/marketmodel';
import { UserModel } from 'src/app/models/UserModel';
@Injectable({
  providedIn: 'root',
})
export class StateService {
  initialState = {
    loggedIn: false,
    authenticatedPerson: {},
    token: {},
  };

  userState: UserModel = {
    userId: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    authMethod: '',
    avatarUrl: '',
    currentCash: 0,
    messages: [],
    cryptos: [],
    activities: [],
    transactions: [],
  };

  marketState: MarketModel = {
    marketId: '',
    offers: [],
    cryptoSymbols: [],
  };

  market = new BehaviorSubject(this.marketState);
  state = new BehaviorSubject(this.initialState);
  user: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(
    this.userState
  );
  constructor() {
    this.user
      .pipe(
        tap((data) => {
          this.userState = data;
        })
      )
      .subscribe();
  }

  public buyCryptoEvent(
    cash: number,
    crypto: UserCryptosList,
    user?: UserModel
  ): void {
    if (user) {
      const newCash = user.currentCash - cash;

      const updatedUser = {
        ...this.addOrCreateCryptoToUser(crypto, user),
        currentCash: newCash,
      };
      this.user.next(updatedUser);
    }
  }

  sellCryptoEvent(cash: number, crypto: UserCryptosList, user?: UserModel) {
    if (user) {
      const newCash = user.currentCash + cash;

      const updatedUser = {
        ...this.subtractOrRemoveCryptoToUser(crypto, user),
        currentCash: newCash,
      };
      this.user.next(updatedUser);
    }
  }

  private subtractOrRemoveCryptoToUser(
    crypto: UserCryptosList,
    user: UserModel
  ) {
    const indexCryptoFound = user.cryptos.findIndex(
      (cryp) => cryp.symbol === crypto.symbol
    );

    const crytpoAmount = user.cryptos[indexCryptoFound].amount;
    const newCryptoAmount = crytpoAmount - crypto.amount;

    console.log(newCryptoAmount);

    if (newCryptoAmount === 0) {
      user.cryptos = user.cryptos.filter(
        (cryp) => cryp.symbol !== crypto.symbol
      );
    } else user.cryptos[indexCryptoFound].amount = newCryptoAmount;

    return user;
  }

  private addOrCreateCryptoToUser(
    crypto: UserCryptosList,
    user: UserModel
  ): UserModel {
    const indexCryptoFound = user.cryptos.findIndex(
      (cryp) => cryp.symbol === crypto.symbol
    );

    indexCryptoFound === -1
      ? user.cryptos.push(crypto)
      : (user.cryptos[indexCryptoFound].amount += crypto.amount);

    return user;
  }
}
