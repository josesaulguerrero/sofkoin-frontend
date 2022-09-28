import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorModel } from 'src/app/models/errorModel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BetarequestService } from 'src/app/services/request/betarequest.service';
import { StateService } from 'src/app/services/state/state.service';
import { UserCryptosList } from 'src/app/models/CryptoUsrList';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private betarequest: BetarequestService,
    private state: StateService
  ) {}

  userIsLoaded: boolean = false;

  name: string = '';
  surname: string = '';
  email: string = '';
  phone: string = '';
  cash?: number;
  avatarurl: string = '';
  usercryptolist?: UserCryptosList[];
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.asyncgetUserData();
  }

  async asyncgetUserData() {
    let userId = localStorage.getItem('userId')!;
    this.betarequest.getUserByIdMethod(userId).subscribe({
      next: (user) => {
        if (user) {
          this.state.user.next(user);
          this.name = this.state.user.value.fullName;
          this.surname = '';
          this.email = this.state.user.value.email;
          this.phone = this.state.user.value.phoneNumber;
          this.cash = this.state.user.value.currentCash;
          this.avatarurl = this.state.user.value.avatarUrl;
          this.usercryptolist = this.state.user.value.cryptos;
          this.userIsLoaded = true;
          this.renderPie();
        }
      },
      error: (err: ErrorModel) => {
        alert('The user is not registered: ' + err.error.errorMessage);
      },
    });
  }
  renderPie() {
    var canvas = document.getElementById('can') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d')!;
    var lastend = 0;
    var data: number[] = [];
    var labels: string[] = [];

    this.usercryptolist?.forEach((crypto) => {
      data.push(crypto.priceUsd);
      labels.push(crypto.symbol);
    });

    var myTotal = 0;
    var myColor = [
      '#6f00d0',
      '#ff3eaf',
      '#090947',
      '#009bff',
      '#2a358c',
      '#6f00d0',
      '#ff3eaf',
      '#090947',
      '#009bff',
      '#2a358c',
    ];
    //var labels = ['A', 'B', 'C', 'D'];

    for (var e = 0; e < data.length; e++) {
      myTotal += data[e];
    }

    // make the chart 10 px smaller to fit on canvas
    var off = 10;
    var w = (canvas.width - off) / 2;
    var h = (canvas.height - off) / 2;
    for (var i = 0; i < data.length; i++) {
      ctx.fillStyle = myColor[i];
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w, h);
      var len = (data[i] / myTotal) * 2 * Math.PI;
      var r = h - off / 2;
      ctx.arc(w, h, r, lastend, lastend + len, false);
      ctx.lineTo(w, h);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var mid = lastend + len / 2;
      ctx.fillText(
        labels[i],
        w + Math.cos(mid) * (r / 2),
        h + Math.sin(mid) * (r / 2)
      );
      lastend += Math.PI * 2 * (data[i] / myTotal);
    }
  }
}
