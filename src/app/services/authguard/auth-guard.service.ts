import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthState } from 'src/app/models/stateModel';
import { AuthService } from '../auth/auth.service';
import { StateService } from '../state/state.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    public out: AuthService,
    private state: StateService,
    private router: Router
  ) {}

  authState?: AuthState;
  canActivate(): boolean {
    this.state.state.subscribe((data) => {
      this.authState = data;
      console.log(this.authState);
    });

    if (!this.authState?.loggedIn) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
  /* public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }*/
}
