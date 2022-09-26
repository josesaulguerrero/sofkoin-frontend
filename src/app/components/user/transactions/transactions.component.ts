import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionsList } from 'src/app/models/transactionList';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  constructor(
    private route: Router,
    private state: StateService,
    private betaReques: BetarequestService
  ) {}
  transactions?: TransactionsList[];

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getUserState();
  }
  getUserState() {
    this.state.user.subscribe((data) => {
      this.transactions = data.transactions;
      console.log(this.transactions);
    });
  }
}
