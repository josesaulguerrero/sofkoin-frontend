import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  @Input() mainitem?: string;
  @Input() sidebaritems?: string[];
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  doSomething() {
    this.sidebaritems?.forEach((element) => {
      let nonselecteditem = document.getElementById(element);
      nonselecteditem!.className === 'nonselected';
    });

    let selecteditem = document.getElementById(
      window.location.href.split('/')[5]
    );
    selecteditem!.className = 'selected';
  }

  activeItem(item: string) {
    this.sidebaritems?.forEach((element) => {
      let nonselecteditem = document.getElementById(element);
      nonselecteditem!.className = 'nonselected';
    });
    let selecteditem = document.getElementById(item);
    selecteditem!.className = 'selected';
  }
}
