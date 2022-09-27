import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
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
  public updateCash(cash: number): void {
    let subscription = this.user.subscribe((user) => {
      this.user.next({ ...user, currentCash: cash });
    });

    subscription.unsubscribe();
  }
}
