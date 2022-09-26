import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorModel } from 'src/app/models/errorModel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private betarequest: BetarequestService,
    private state: StateService
  ) {}

  userIsLoaded: boolean = false;

  name: string = '';
  surname: string = '';
  email: string = '';
  phone: string = '';
  cash: string = '';
  avatarurl: string = '';
  usercryptolist?: UserCryptosList[];
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.asyncgetUserData();
  }

  async asyncgetUserData() {
    let userId = localStorage.getItem('userId')!;
    this.betarequest.getUserByIdMethod(userId).subscribe({
      next: (user) => {
        if (user) {
          this.state.user.next(user);
          console.log(this.state.user);
          this.name = this.state.user.value.fullName;
          this.surname = '';
          this.email = this.state.user.value.email;
          this.phone = this.state.user.value.phoneNumber;
          this.cash = this.state.user.value.currentCash;
          this.avatarurl = this.state.user.value.avatarUrl;
          this.usercryptolist = this.state.user.value.cryptos;
          this.userIsLoaded = true;
        }
      },
      error: (err: ErrorModel) => {
        alert('The user is not registered: ' + err.error.errorMessage);
      },
    });
  }
}
