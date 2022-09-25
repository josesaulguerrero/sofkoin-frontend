import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthState } from 'src/app/models/stateModel';
import { AuthService } from '../auth/auth.service';
import { StateService } from '../state/state.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    private state: StateService,
    private router: Router
  ) {}

  authState?: AuthState;

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    }
    localStorage.clear();
    this.router.navigate(['']);
    return false;
  }

  public isAuthenticated(): boolean {
    return this.auth.isLoggedIn();
  }
}
