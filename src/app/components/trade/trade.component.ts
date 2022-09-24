import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit {
  constructor() {}
  sidebaritems?: string[];
  ngOnInit(): void {
    this.sidebaritems = ['Recharge', 'Buy', 'Sell'];
  }
}
