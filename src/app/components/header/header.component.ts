import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    let selecteditem = document.getElementById('user');
    selecteditem!.className = 'mainitembuttonselected';
  }
  select(selected: string) {
    let nonselecteditem = document.getElementsByClassName(
      'mainitembuttonselected'
    )[0] as HTMLButtonElement;
    nonselecteditem.className = 'mainitembutton';
    console.log(nonselecteditem);
    let selecteditem = document.getElementById(selected);
    selecteditem!.className = 'mainitembuttonselected';
  }
}
