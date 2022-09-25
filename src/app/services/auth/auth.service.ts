import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import {
  Auth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from '@angular/fire/auth';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  helper = new JwtHelperService();

  isLoggedIn() {
    const token = localStorage.getItem('token') as string;
    return !this.helper.isTokenExpired(token);
  }

  logInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  logInWithGithub() {
    return signInWithPopup(this.auth, new GithubAuthProvider());
  }

  logOut() {
    localStorage.clear();
  }
}
