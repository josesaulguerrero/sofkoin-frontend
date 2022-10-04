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
    let canvas = document.getElementById('can') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d')!;
    let lastend = 0;
    let data: number[] = [];
    let labels: string[] = [];

    this.cryptos.forEach((crypto) => {
      data.push(crypto.priceUsd);
      labels.push(crypto.symbol);
    });

    let myTotal = 0;
    let myColor = [
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
    //let labels = ['A', 'B', 'C', 'D'];

    for (let e = 0; e < data.length; e++) {
      myTotal += data[e];
    }

    // make the chart 10 px smaller to fit on canvas
    let off = 10;
    let w = (canvas.width - off) / 2;
    let h = (canvas.height - off) / 2;
    for (let i = 0; i < data.length; i++) {
      ctx.fillStyle = myColor[i];
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w, h);
      let len = (data[i] / myTotal) * 2 * Math.PI;
      let r = h - off / 2;
      ctx.arc(w, h, r, lastend, lastend + len, false);
      ctx.lineTo(w, h);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let mid = lastend + len / 2;
      ctx.fillText(
        labels[i],
        w + Math.cos(mid) * (r / 2),
        h + Math.sin(mid) * (r / 2)
      );
      lastend += Math.PI * 2 * (data[i] / myTotal);
    }
  }
}
