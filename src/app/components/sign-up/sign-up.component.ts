import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { Router } from '@angular/router';
import { ErrorModel } from 'src/app/models/errorModel';

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

  newEmail: string = '';
  newName: string = '';
  newPassword: string = '';
  newConfirmPassword: string = '';
  newSurname: string = '';
  newPhoneNumber: string = '';

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  playcat() {
    var audiocat = new Audio('../../../assets/audio/Cute-cat-meow-sound.mp3');
    audiocat.play();
  }

  async asyncsignupWithGoogle() {
    let path = document.querySelector(
      "input[type='radio'][name=avatar]:checked"
    ) as HTMLInputElement;
    let radio1 = document.getElementById('radio1') as HTMLInputElement;
    let radio2 = document.getElementById('radio2') as HTMLInputElement;
    let radio3 = document.getElementById('radio3') as HTMLInputElement;
    let radio4 = document.getElementById('radio4') as HTMLInputElement;
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
        this.request
          .signUpMethod({
            email: response.user.email,
            name: response.user.displayName
              ? response.user.displayName?.split(' ')[0]
              : 'Anonymus',
            password: response.user.email,
            surname: response.user.displayName
              ? response.user.displayName?.split(' ')[1]
              : 'GoogleUser',
            phoneNumber: '0000000000',
            avatarUrl: path.value,
            authMethod: 'GMAIL',
          })
          .subscribe({
            next: (data) => {
              this.router.navigateByUrl('/login');
            },
            error: (err: ErrorModel) => {
              alert('An error occurred: ' + err.error.errorMessage);
            },
          });
      }
    }
  }
  async asyncsignupWithGitHub() {
    let path = document.querySelector(
      "input[type='radio'][name=avatar]:checked"
    ) as HTMLInputElement;
    let radio1 = document.getElementById('radio1') as HTMLInputElement;
    let radio2 = document.getElementById('radio2') as HTMLInputElement;
    let radio3 = document.getElementById('radio3') as HTMLInputElement;
    let radio4 = document.getElementById('radio4') as HTMLInputElement;
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
            name: response.user.displayName
              ? response.user.displayName?.split(' ')[0]
              : 'Anonymus',
            password: response.user.email,
            surname: response.user.displayName
              ? response.user.displayName?.split(' ')[1]
              : 'GithubUser',
            phoneNumber: '0000000000',
            avatarUrl: path.value,
            authMethod: 'GITHUB',
          })
          .subscribe({
            next: (data) => {
              this.router.navigateByUrl('/login');
            },
            error: (err: ErrorModel) => {
              alert('An error occurred: ' + err.error.errorMessage);
            },
          });
      }
    }
  }

  async asyncsignupWithEmail() {
    let path = document.querySelector(
      "input[type='radio'][name=avatar]:checked"
    ) as HTMLInputElement;

    if (this.validation()) {
      this.request
        .signUpMethod({
          email: this.newEmail,
          name: this.newName,
          password: this.newPassword,
          surname: this.newSurname,
          phoneNumber: this.newPhoneNumber,
          avatarUrl: path.value,
          authMethod: 'MANUAL',
        })
        .subscribe({
          next: (data) => {
            this.router.navigateByUrl('/login');
          },
          error: (err: ErrorModel) => {
            alert('An error occurred: ' + err.error.errorMessage);
          },
        });
    }
  }

  validation(): boolean {
    if (this.newName.length < 4) {
      alert('The name must have at least 4 characters');
      return false;
    }

    if (this.newSurname.length < 4) {
      alert('The surname must have at least 4 characters');
      return false;
    }

    let phoneRx = new RegExp('^[0-9]{10}$');
    if (phoneRx.test(this.newPhoneNumber) === false) {
      alert('Phone number must have 10 digits and only numbers');
      return false;
    }
    //^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
    let rEmail =
      /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

    if (rEmail.test(this.newEmail) === false) {
      alert('The email field is invalid');
      return false;
    }

    if (this.newPassword !== this.newConfirmPassword) {
      alert('Password must match');
      return false;
    }

    let passwordRx = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    if (!passwordRx.test(this.newPassword)) {
      alert(
        'The password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number:'
      );
      return false;
    }

    let radio1 = document.getElementById('radio1') as HTMLInputElement;
    let radio2 = document.getElementById('radio2') as HTMLInputElement;
    let radio3 = document.getElementById('radio3') as HTMLInputElement;
    let radio4 = document.getElementById('radio4') as HTMLInputElement;
    if (
      !radio1.checked &&
      !radio2.checked &&
      !radio3.checked &&
      !radio4.checked
    ) {
      alert('Please adopt a Cat');
      return false;
    }

    return true;
  }
}
