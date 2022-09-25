import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css'],
})
export class RechargeComponent implements OnInit {
  constructor() {}
  newRecharge: string = '';
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
  actionRecharge() {}
}
