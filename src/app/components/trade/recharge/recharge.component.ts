import { Component, OnInit } from '@angular/core';
import { commandFundWallet } from 'src/app/models/commands/commandFundWallet';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { ErrorModel } from 'src/app/models/errorModel';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/services/state/ngrx/selectors/user-selectors';
import { fundAction } from 'src/app/services/state/ngrx/actions/user/fundAction';
import { UserModel } from 'src/app/models/UserModel';
import { StateService } from 'src/app/services/state/state.service';
import {
  errorAlert,
  successAlert,
} from 'src/app/services/sweet-alert-funcs/alerts';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css'],
})
export class RechargeComponent implements OnInit {
  constructor(private request: RequestService, private store: Store) {}
  newRecharge?: number;
  userSelector = this.store.select(selectUser);
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  actionRecharge() {
    if (!(this.newRecharge === undefined) && this.newRecharge > 0) {
      let command: commandFundWallet;
      let token = localStorage.getItem('token')!;
      let userId = localStorage.getItem('userId')!;
      let Amount = String(this.newRecharge);
      command = {
        userId: userId!,
        cashAmount: Amount,
      };
      this.request.fundMethod(command, token).subscribe({
        next: (data) => {
          const fundEvent = data[0];
          this.newRecharge = undefined;
          this.store.dispatch(fundAction({ cash: fundEvent.cashAmount }));
          successAlert('You fund successfully!');
          this.cleanInputs();
        },
        error: (err: ErrorModel) => {
          if (
            err.error.errorMessage === null ||
            err.error.errorMessage === undefined
          ) {
            errorAlert('Something went wrong.');
            this.cleanInputs();
          } else {
            errorAlert(err.error.errorMessage);
            this.cleanInputs();
          }
        },
      });
    } else {
      errorAlert('Something went wrong.');
      this.cleanInputs();
    }
  }

  private cleanInputs() {
    this.newRecharge = undefined;
  }
}
