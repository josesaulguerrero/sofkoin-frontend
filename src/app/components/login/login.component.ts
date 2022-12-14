import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorModel } from 'src/app/models/errorModel';
import { TokenResponse } from 'src/app/models/tokenResponseModel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { StateService } from 'src/app/services/state/state.service';
import { errorAlert } from 'src/app/services/sweet-alert-funcs/alerts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private request: RequestService,
    private state: StateService
  ) {}

  newEmail: string = '';
  newPassword: string = '';

  tokenResponse: TokenResponse[] = [];

  ngOnInit(): void {
    this.start();
  }
  start() {}

  async asyncloginWithGoogle() {
    const response = await this.authService.logInWithGoogle();
    if (response) {
      this.request
        .loginMethod({
          email: response.user.email,
          password: response.user.email,
          authMethod: 'GMAIL',
        })
        .subscribe({
          next: (token) => {
            if (token) {
              localStorage.setItem('token', token[0].jwt);
              localStorage.setItem('userId', token[0].userId);
              this.state.state.next({
                loggedIn: true,
                authenticatedPerson: response,
                token: token[0].jwt,
              });
              this.router.navigateByUrl('/main');
            }
          },
          error: (err: ErrorModel) => {
            errorAlert('The user is not registered: ' + err.error.errorMessage);
            this.router.navigateByUrl('/login');
          },
        });
    }
  }

  async asyncloginWithGitHub() {
    const response = await this.authService.logInWithGithub();
    if (response) {
      this.request
        .loginMethod({
          email: response.user.email,
          password: response.user.email,
          authMethod: 'GITHUB',
        })
        .subscribe({
          next: (token) => {
            if (token) {
              localStorage.setItem('token', token[0].jwt);
              localStorage.setItem('userId', token[0].userId);
              this.state.state.next({
                loggedIn: true,
                authenticatedPerson: response,
                token: token[0].jwt,
              });
              this.router.navigateByUrl('/main');
            }
          },
          error: (err: ErrorModel) => {
            errorAlert('The user is not registered: ' + err.error.errorMessage);
          },
        });
    }
  }

  async asyncloginWithEmail() {
    if (this.validation()) {
      this.request
        .loginMethod({
          email: this.newEmail,
          password: this.newPassword,
          authMethod: 'MANUAL',
        })
        .subscribe({
          next: (token) => {
            if (token) {
              localStorage.setItem('token', token[0].jwt);
              localStorage.setItem('userId', token[0].userId);
              this.state.state.next({
                loggedIn: true,
                authenticatedPerson: token,
                token: token[0].jwt,
              });
              this.router.navigateByUrl('/main');
            }
          },
          error: (err: ErrorModel) => {
            if (
              err.error.errorMessage === null ||
              err.error.errorMessage === undefined
            ) {
              errorAlert('Email or password invalid: ');
            } else {
              errorAlert(err.error.errorMessage);
              this.router.navigateByUrl('/login');
            }
          },
        });
    }
  }

  validation(): boolean {
    //^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
    let rEmail =
      /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

    if (rEmail.test(this.newEmail) === false) {
      errorAlert('The email field is invalid');
      return false;
    }

    let passwordRx = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    if (!passwordRx.test(this.newPassword)) {
      errorAlert(
        'The password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number:'
      );
      return false;
    }
    return true;
  }
}
