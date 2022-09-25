import { transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  mainitem?: string;
  sidebaritems?: string[];
  constructor(private router: Router) {}
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.mainitem = 'user';
    this.sidebaritems = ['Profile', 'Transactions', 'Activity', 'Messages'];
  }
}
