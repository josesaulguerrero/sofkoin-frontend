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
    let flag = true;
    this.sidebaritems?.forEach((element) => {
      let nonselecteditem = document.getElementById(element);
      if (nonselecteditem!.className === 'selected') {
        flag = false;
      }
    });
    if (flag) {
      this.start();
    }
  }
  start() {
    let selecteditem = document.getElementById(this.sidebaritems![0]);
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
