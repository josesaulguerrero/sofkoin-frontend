import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthState } from 'src/app/models/stateModel';
import { AuthService } from '../auth/auth.service';
import { RequestService } from '../request/alpharequest.service';
import { StateService } from '../state/state.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    private state: StateService,
    private router: Router,
    private alphaRequest: RequestService
  ) {}

  authState?: AuthState;

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    }
    if (localStorage.getItem('token') !== '') {
      this.alphaRequest.logout(
        { userId: localStorage.getItem('userId') },
        localStorage.getItem('token') as string
      );
    }
    localStorage.clear();
    this.router.navigate(['']);
    return false;
  }

  public isAuthenticated(): boolean {
    return this.auth.isLoggedIn();
  }
}
