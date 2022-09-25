import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit {
  constructor() {}
  mainitem?: string;
  sidebaritems?: string[];
  ngOnInit(): void {
    this.mainitem = 'trade';
    this.sidebaritems = ['Recharge', 'Buy', 'Sell'];
  }
}
