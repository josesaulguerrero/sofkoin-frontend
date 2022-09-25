import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
})
export class BuyComponent implements OnInit {
  constructor() {}
  cashavalible: string = '2134';
  newCryptoBuy: string = '';
  newCryptolist: string[] = [
    'BTC',
    'ETH',
    'BNB',
    'ADA',
    'SOL',
    'XRP',
    'DOT',
    'TRX',
    'AVAX',
    'ETC',
  ];
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
  actionBuy() {
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    console.log(token);
  }
}
