import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.start();
  }
  start() {}

  async asyncloginWithGoogle() {}

  async asyncloginWithGitHube() {}

  async asyncloginWithEmail() {}
}
