import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestService } from 'src/app/services/request/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private request: RequestService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  async asyncsignupWithGoogle() {
    var path = document.querySelector(
      "input[type='radio'][name=avatar]:checked"
    ) as HTMLInputElement;
    var radio1 = document.getElementById('radio1') as HTMLInputElement;
    var radio2 = document.getElementById('radio2') as HTMLInputElement;
    var radio3 = document.getElementById('radio3') as HTMLInputElement;
    var radio4 = document.getElementById('radio4') as HTMLInputElement;
    if (
      !radio1.checked &&
      !radio2.checked &&
      !radio3.checked &&
      !radio4.checked
    ) {
      alert('Please adopt a Cat');
    }
    if (radio1.checked || radio2.checked || radio3.checked || radio4.checked) {
      const response = await this.authService.logInWithGoogle();

      if (response) {
        console.log(path.value);
        this.request.signUpMethod({
          email: response.user.email,
          name: response.user.displayName?.split(' ')[0],
          password: response.user.email,
          surname: response.user.displayName?.split(' ')[1],
          phoneNumber: '0000000000',
          avatarUrl: path.value,
          authMethod: 'GMAIL',
        });
      }
    }
  }
  async asyncsignupWithGitHube() {
    var path = document.querySelector(
      "input[type='radio'][name=avatar]:checked"
    ) as HTMLInputElement;
    var radio1 = document.getElementById('radio1') as HTMLInputElement;
    var radio2 = document.getElementById('radio2') as HTMLInputElement;
    var radio3 = document.getElementById('radio3') as HTMLInputElement;
    var radio4 = document.getElementById('radio4') as HTMLInputElement;
    if (
      !radio1.checked &&
      !radio2.checked &&
      !radio3.checked &&
      !radio4.checked
    ) {
      alert('Please adopt a Cat');
    }
    if (radio1.checked || radio2.checked || radio3.checked || radio4.checked) {
      const response = await this.authService.logInWithGithub();
      console.log(response);
      if (response) {
        this.request
          .signUpMethod({
            email: response.user.email,
            name: response.user.displayName?.split(' ')[0],
            password: response.user.email,
            surname: response.user.displayName?.split(' ')[1],
            phoneNumber: '0000000000',
            avatarUrl: path.value,
            authMethod: 'GITHUB',
          })
          .subscribe((data) => console.log(data));
        this.router.navigateByUrl('/login');
      }
    }
  }

  async asyncsignupWithEmail() {}
}
