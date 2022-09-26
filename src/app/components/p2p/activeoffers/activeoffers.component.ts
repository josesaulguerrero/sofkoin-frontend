import { Component, OnInit } from '@angular/core';
import { ErrorModel } from 'src/app/models/errorModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';
@Component({
  selector: 'app-activeoffers',
  templateUrl: './activeoffers.component.html',
  styleUrls: ['./activeoffers.component.css'],
})
export class ActiveoffersComponent implements OnInit {
  constructor(
    private request: RequestService,
    private state: StateService,
    private betarequest: BetarequestService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getMarket();
  }

  getMarket() {
    ///Atennnnnnnnnnntioooooooooooonnnnnnnnn maybe it iis better to allway call the market????????
    if (this.state.market.value.marketId === '' || null || undefined) {
      this.betarequest.geAllMarketsMethod().subscribe({
        next: (market) => {
          localStorage.setItem('marketId', market[0].marketId);
          console.log('conected to market');
          this.state.market.next(market[0]);
        },
        error: (err: ErrorModel) => {
          if (
            err.error.errorMessage === null ||
            err.error.errorMessage === undefined
          ) {
            alert('Something went wrong with the market');
          } else {
            alert(err.error.errorMessage);
          }
        },
      });
    }
  }
}
