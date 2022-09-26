import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestService } from 'src/app/services/request/alpharequest.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private alphaRequest: RequestService
  ) {}
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    /* let selecteditem = document.getElementById('user');
    selecteditem!.className = 'mainitembuttonselected';*/
  }
  @HostListener('window:load')
  onPageLoaded() {
    console.log(window.location.href.split('/')[4]);
    this.select(window.location.href.split('/')[4]);
  }
  select(selected: string) {
    let selecteditem1 = document.getElementById('user');
    selecteditem1!.className = 'mainitembutton';
    let selecteditem2 = document.getElementById('p2p');
    selecteditem2!.className = 'mainitembutton';
    let selecteditem3 = document.getElementById('trade');
    selecteditem3!.className = 'mainitembutton';
    let selecteditem = document.getElementById(selected);
    selecteditem!.className = 'mainitembuttonselected';
  }

  logOut() {
    this.alphaRequest
      .logout(
        { userId: localStorage.getItem('userId') },
        localStorage.getItem('token') as string
      )
      .subscribe((data) => console.log(data));
    this.auth.logOut();
  }
}
