import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProfileUserData } from 'src/app/services/state/ngrx/selectors/user-selectors';
import { UserCrypto } from 'src/app/models/UserCrypto';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private store: Store) {}

  // Profile Customize Selector
  profileDataSelector = this.store.select(selectProfileUserData);

  // Component necessary data
  avatarUrl: string = '';
  fullName: string = '';
  email: string = '';
  phoneNumber: string = '';
  currentCash: number = 0;
  cryptos: UserCrypto[] = [];

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.profileDataSelector.subscribe((profile) => {
      this.avatarUrl = profile.avatarUrl;
      this.fullName = profile.fullName;
      this.email = profile.email;
      this.phoneNumber = profile.phoneNumber;
      this.currentCash = profile.currentCash;
      this.cryptos = profile.cryptos;
      if (this.cryptos.length) {
        try {
          this.renderPie();
        } catch (_error) {}
      }
    });
  }

  renderPie() {
    var canvas = document.getElementById('can') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d')!;
    var lastend = 0;
    var data: number[] = [];
    var labels: string[] = [];

    this.cryptos.forEach((crypto) => {
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
