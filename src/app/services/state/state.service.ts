import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    avatarUrl: '',
    currentCash: '',
    messages: [],
    cryptos: [],
    activities: [],
    transactions: [],
  };

  state = new BehaviorSubject(this.initialState);
  user = new BehaviorSubject(this.userState);
  constructor() {}
}
