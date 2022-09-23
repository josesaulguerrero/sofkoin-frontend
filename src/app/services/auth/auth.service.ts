import { Injectable } from '@angular/core';

import {
  Auth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  logInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  logInWithGithub() {
    return signInWithPopup(this.auth, new GithubAuthProvider());
  }
}
