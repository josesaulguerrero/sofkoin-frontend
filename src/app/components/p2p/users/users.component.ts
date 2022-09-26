import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';
import { RequestService } from 'src/app/services/request/alpharequest.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { ErrorModel } from 'src/app/models/errorModel';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  constructor(
    private alphaRequest: RequestService,
    private betaRequest: BetarequestService
  ) {}
  users?: UserModel[];
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.loadusers();
  }
  async loadusers() {
    this.betaRequest.geAllUserMethod().subscribe({
      next: (getusers) => {
        if (getusers) {
          this.users = getusers;
          console.log(getusers);
        }
      },
      error: (err: ErrorModel) => {
        alert('The user is not registered: ' + err.error.errorMessage);
      },
    });
  }

  OwnUser(currentuserid: string): boolean {
    if (currentuserid === localStorage.getItem('userId')) {
      return false;
    }
    return true;
  }
  collapsible(id: string) {
    let content = document.getElementById(id);
    if (content!.className === 'hiddendata') {
      content!.className = 'showdata';
    } else {
      content!.className = 'hiddendata';
    }
  }
}
