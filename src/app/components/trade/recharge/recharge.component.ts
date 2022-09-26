import { Component, OnInit } from '@angular/core';
import { commandFundWallet } from 'src/app/models/commands/commandFundWallet';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { ErrorModel } from 'src/app/models/errorModel';
@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css'],
})
export class RechargeComponent implements OnInit {
  constructor(private request: RequestService) {}
  newRecharge?: number;
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
        next: () => {
          alert('Transaction complete');
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
    } else {
      alert('Something went wrong');
    }
  }
}
